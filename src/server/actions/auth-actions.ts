"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  clearAuthFailures,
  getAuthRateLimitState,
  registerAuthFailure,
} from "@/lib/auth-rate-limit";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";
import {
  DEMO_SCENARIO_COOKIE,
  DEMO_SESSION_COOKIE,
  SESSION_USER_COOKIE,
  WORKSPACE_PRESET_COOKIE,
} from "@/lib/constants/app";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { isSupabaseConfigured } from "@/lib/auth/supabase-config";
import {
  getAccessStateForEmail,
  getSessionUser,
  serializeSessionUser,
} from "@/lib/auth/session";
import { getSessionCookieOptions } from "@/lib/security";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { SessionUser, WorkspacePreset } from "@/types";
import { recordAuditEvent } from "@/server/services/audit-service";
import { provisionUserWorkspace } from "@/server/services/account-provisioning-service";

const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .max(120, "Use no máximo 120 caracteres."),
});

function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!appUrl) {
    return "http://localhost:3000";
  }

  return appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
}

async function getRegisteredFullName(email: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { fullName: true },
  });

  return user?.fullName?.trim() || null;
}

function setSessionCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  {
    email,
    fullName,
    scenario,
    workspacePreset,
  }: SessionUser & {
    scenario: "trialing" | "active" | "expired" | "past_due";
    workspacePreset: WorkspacePreset;
  },
) {
  const cookieOptions = getSessionCookieOptions();

  cookieStore.set(DEMO_SESSION_COOKIE, email, cookieOptions);
  cookieStore.set(DEMO_SCENARIO_COOKIE, scenario, cookieOptions);
  cookieStore.set(
    SESSION_USER_COOKIE,
    serializeSessionUser({ email, fullName }),
    cookieOptions,
  );
  cookieStore.set(WORKSPACE_PRESET_COOKIE, workspacePreset, cookieOptions);
}

export async function signInAction(values: unknown) {
  const payload = loginSchema.parse(values);
  const rateLimit = await getAuthRateLimitState("login");
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfterSeconds}s.`,
    };
  }

  const cookieStore = await cookies();
  const registeredFullName = await getRegisteredFullName(normalizedEmail);
  let sessionUser: SessionUser = {
    email: normalizedEmail,
    fullName:
      registeredFullName || (normalizedEmail.split("@")[0] ?? "Responsavel"),
  };
  let workspacePreset: WorkspacePreset = "blank";

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: payload.password,
    });

    if (error) {
      registerAuthFailure(rateLimit.key);
      return {
        success: false,
        message:
          "Credenciais inválidas ou acesso temporariamente indisponível.",
      };
    }

    if (data.user) {
      sessionUser = {
        email: data.user.email?.trim().toLowerCase() ?? normalizedEmail,
        fullName:
          typeof data.user.user_metadata.full_name === "string" &&
          data.user.user_metadata.full_name
            ? data.user.user_metadata.full_name
            : sessionUser.fullName,
      };
      workspacePreset = "blank";
    }
  } else {
    registerAuthFailure(rateLimit.key);
    return {
      success: false,
      message: "Autenticação indisponível para este ambiente.",
    };
  }

  clearAuthFailures(rateLimit.key);
  if (isDatabaseConfigured()) {
    await provisionUserWorkspace({
      email: sessionUser.email,
      fullName: sessionUser.fullName,
    });
  }
  const accessState = await getAccessStateForEmail(sessionUser.email);
  await recordAuditEvent({
    email: sessionUser.email,
    fullName: sessionUser.fullName,
    action: "auth.sign_in",
    entityType: "User",
    metadata: {
      scenario: accessState.scenario,
      workspacePreset,
    },
  });

  setSessionCookies(cookieStore, {
    ...sessionUser,
    scenario: accessState.scenario,
    workspacePreset,
  });

  revalidatePath("/");
  return {
    success: true,
    redirectTo: accessState.hasAccess ? "/dashboard" : "/billing/locked",
  };
}

export async function signUpAction(values: unknown) {
  const payload = registerSchema.parse(values);
  const rateLimit = await getAuthRateLimitState("signup");

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfterSeconds}s.`,
    };
  }

  const cookieStore = await cookies();

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
        },
        emailRedirectTo: `${getAppUrl()}/login?confirmed=1`,
      },
    });

    if (error) {
      registerAuthFailure(rateLimit.key);
      return { success: false, message: "Não foi possível criar a conta." };
    }

    await provisionUserWorkspace({
      email: payload.email,
      fullName: payload.fullName,
      supabaseUserId: data.user?.id,
    });
    await recordAuditEvent({
      email: payload.email,
      fullName: payload.fullName,
      supabaseUserId: data.user?.id,
      action: "auth.sign_up",
      entityType: "User",
      entityId: data.user?.id,
      metadata: {
        emailConfirmed: Boolean(data.session),
      },
    });

    clearAuthFailures(rateLimit.key);

    if (!data.session) {
      return { success: true, redirectTo: "/login?checkEmail=1" };
    }
  } else {
    registerAuthFailure(rateLimit.key);
    return {
      success: false,
      message: "Cadastro indisponível sem autenticação configurada.",
    };
  }

  setSessionCookies(cookieStore, {
    email: payload.email,
    fullName: payload.fullName,
    scenario: "trialing",
    workspacePreset: "blank",
  });

  revalidatePath("/");
  return { success: true, redirectTo: "/dashboard/financas" };
}

export async function signOutAction() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    await recordAuditEvent({
      email: sessionUser.email,
      fullName: sessionUser.fullName,
      action: "auth.sign_out",
      entityType: "User",
    });
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.delete(DEMO_SCENARIO_COOKIE);
  cookieStore.delete(SESSION_USER_COOKIE);
  cookieStore.delete(WORKSPACE_PRESET_COOKIE);
  redirect("/login");
}

export async function requestPasswordResetAction(values: unknown) {
  const payload = passwordResetRequestSchema.parse(values);
  const rateLimit = await getAuthRateLimitState("password-reset");

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfterSeconds}s.`,
    };
  }

  if (!isSupabaseConfigured()) {
    registerAuthFailure(rateLimit.key);
    return {
      success: false,
      message: "Recuperação de senha indisponível sem Supabase configurado.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
    redirectTo: `${getAppUrl()}/reset-password`,
  });

  if (error) {
    registerAuthFailure(rateLimit.key);
    return {
      success: false,
      message: "Não foi possível iniciar a redefinição de senha.",
    };
  }

  clearAuthFailures(rateLimit.key);

  await recordAuditEvent({
    email: payload.email,
    action: "auth.password_reset_requested",
    entityType: "User",
  });

  return {
    success: true,
    message:
      "Se existir uma conta com esse e-mail, o link de redefinição foi enviado.",
  };
}

export async function recordPasswordResetCompletedAction(values: unknown) {
  const payload = z
    .object({
      email: z
        .string()
        .trim()
        .email("Informe um e-mail válido.")
        .max(120, "Use no máximo 120 caracteres."),
      fullName: z.string().trim().max(80).optional(),
      supabaseUserId: z.string().trim().max(128).optional(),
    })
    .parse(values);

  await provisionUserWorkspace({
    email: payload.email,
    fullName: payload.fullName,
    supabaseUserId: payload.supabaseUserId,
  });
  await recordAuditEvent({
    email: payload.email,
    fullName: payload.fullName,
    supabaseUserId: payload.supabaseUserId,
    action: "auth.password_reset_completed",
    entityType: "User",
    entityId: payload.supabaseUserId,
  });

  return { success: true };
}

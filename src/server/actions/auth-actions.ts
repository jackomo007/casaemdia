"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  clearAuthFailures,
  getAuthRateLimitState,
  registerAuthFailure,
} from "@/lib/auth-rate-limit";
import {
  DEMO_SCENARIO_COOKIE,
  DEMO_SESSION_COOKIE,
  SESSION_USER_COOKIE,
  WORKSPACE_PRESET_COOKIE,
} from "@/lib/constants/app";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/auth/supabase";
import { isDemoModeEnabled, serializeSessionUser } from "@/lib/auth/session";
import { getSessionCookieOptions } from "@/lib/security";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { SessionUser, WorkspacePreset } from "@/types";

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

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfterSeconds}s.`,
    };
  }

  const cookieStore = await cookies();
  const isDemoCredentials =
    payload.email === "marina@familiaoliveira.com.br" &&
    payload.password === "123456";
  let sessionUser: SessionUser = {
    email: payload.email,
    fullName:
      payload.email === "marina@familiaoliveira.com.br"
        ? "Marina Oliveira"
        : (payload.email.split("@")[0] ?? "Responsavel"),
  };
  let workspacePreset: WorkspacePreset =
    payload.email === "marina@familiaoliveira.com.br" ? "sample" : "blank";

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error && !(isDemoModeEnabled() && isDemoCredentials)) {
      registerAuthFailure(rateLimit.key);
      return {
        success: false,
        message:
          "Credenciais inválidas ou acesso temporariamente indisponível.",
      };
    }

    if (data.user) {
      sessionUser = {
        email: data.user.email ?? payload.email,
        fullName:
          typeof data.user.user_metadata.full_name === "string" &&
          data.user.user_metadata.full_name
            ? data.user.user_metadata.full_name
            : sessionUser.fullName,
      };
      workspacePreset = "blank";
    }
  } else if (!isDemoModeEnabled() || !isDemoCredentials) {
    registerAuthFailure(rateLimit.key);
    return {
      success: false,
      message: "Autenticação indisponível para este ambiente.",
    };
  }

  clearAuthFailures(rateLimit.key);

  setSessionCookies(cookieStore, {
    ...sessionUser,
    scenario: payload.scenario,
    workspacePreset,
  });

  revalidatePath("/");
  return {
    success: true,
    redirectTo:
      payload.scenario === "expired" ? "/billing/locked" : "/dashboard",
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
    const { error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
        },
      },
    });

    if (error) {
      registerAuthFailure(rateLimit.key);
      return { success: false, message: "Não foi possível criar a conta." };
    }
  } else {
    registerAuthFailure(rateLimit.key);
    return {
      success: false,
      message: "Cadastro indisponível sem autenticação configurada.",
    };
  }

  clearAuthFailures(rateLimit.key);

  setSessionCookies(cookieStore, {
    email: payload.email,
    fullName: payload.fullName,
    scenario: payload.scenario,
    workspacePreset: "blank",
  });

  revalidatePath("/");
  return { success: true, redirectTo: "/dashboard/financas" };
}

export async function signOutAction() {
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

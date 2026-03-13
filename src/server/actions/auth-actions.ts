"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEMO_SCENARIO_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/constants/app";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/auth/supabase";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export async function signInAction(values: unknown) {
  const payload = loginSchema.parse(values);
  const cookieStore = await cookies();

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }
  }

  cookieStore.set(DEMO_SESSION_COOKIE, payload.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(DEMO_SCENARIO_COOKIE, payload.scenario, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
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
      return { success: false, message: error.message };
    }
  }

  cookieStore.set(DEMO_SESSION_COOKIE, payload.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(DEMO_SCENARIO_COOKIE, payload.scenario, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/");
  return { success: true, redirectTo: "/onboarding" };
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.delete(DEMO_SCENARIO_COOKIE);
  redirect("/login");
}

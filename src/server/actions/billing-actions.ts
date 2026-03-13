"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { DEMO_SCENARIO_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/constants/app";
import { selectPlanSchema } from "@/lib/validations/billing";
import { activateSubscriptionPlan } from "@/server/services/billing-service";

export async function selectPlanAction(values: unknown) {
  const payload = selectPlanSchema.parse(values);
  await activateSubscriptionPlan(payload.planCode);

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SCENARIO_COOKIE, "active", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(DEMO_SESSION_COOKIE, "checkout@demo.local", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/dashboard");
  revalidatePath("/billing");
  revalidatePath("/select-plan");

  return { success: true, redirectTo: "/billing/success" };
}

export async function setDemoScenarioAction(scenario: string) {
  const cookieStore = await cookies();
  const nextScenario =
    scenario === "expired" || scenario === "past_due" || scenario === "active"
      ? scenario
      : "trialing";

  cookieStore.set(DEMO_SCENARIO_COOKIE, nextScenario, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/dashboard");
  revalidatePath("/billing");

  return { success: true };
}

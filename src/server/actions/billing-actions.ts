"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { DEMO_SCENARIO_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/constants/app";
import { getSessionUser } from "@/lib/auth/session";
import { getSessionCookieOptions } from "@/lib/security";
import { selectPlanSchema } from "@/lib/validations/billing";
import { activateSubscriptionPlan } from "@/server/services/billing-service";
import { recordAuditEvent } from "@/server/services/audit-service";

export async function selectPlanAction(values: unknown) {
  const payload = selectPlanSchema.parse(values);
  await activateSubscriptionPlan(payload.planCode);

  const cookieStore = await cookies();
  const sessionUser = await getSessionUser();
  const cookieOptions = getSessionCookieOptions();

  cookieStore.set(DEMO_SCENARIO_COOKIE, "active", cookieOptions);
  cookieStore.set(
    DEMO_SESSION_COOKIE,
    sessionUser?.email ?? "checkout@demo.local",
    cookieOptions,
  );

  if (sessionUser) {
    await recordAuditEvent({
      email: sessionUser.email,
      fullName: sessionUser.fullName,
      action: "billing.plan_selected",
      entityType: "Subscription",
      metadata: {
        planCode: payload.planCode,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/billing");
  revalidatePath("/select-plan");

  return { success: true, redirectTo: "/billing/success" };
}

export async function setDemoScenarioAction(scenario: string) {
  const cookieStore = await cookies();
  const cookieOptions = getSessionCookieOptions();
  const nextScenario =
    scenario === "expired" || scenario === "past_due" || scenario === "active"
      ? scenario
      : "trialing";

  cookieStore.set(DEMO_SCENARIO_COOKIE, nextScenario, cookieOptions);

  revalidatePath("/dashboard");
  revalidatePath("/billing");

  return { success: true };
}

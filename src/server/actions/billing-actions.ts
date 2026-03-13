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
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return {
      success: false,
      message: "Faça login para contratar um plano.",
    };
  }

  await activateSubscriptionPlan(payload.planCode);

  const cookieStore = await cookies();
  const cookieOptions = getSessionCookieOptions();

  cookieStore.set(DEMO_SCENARIO_COOKIE, "active", cookieOptions);
  cookieStore.set(DEMO_SESSION_COOKIE, sessionUser.email, cookieOptions);

  await recordAuditEvent({
    email: sessionUser.email,
    fullName: sessionUser.fullName,
    action: "billing.plan_selected",
    entityType: "Subscription",
    metadata: {
      planCode: payload.planCode,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/billing");
  revalidatePath("/billing/locked");
  revalidatePath("/select-plan");

  return { success: true, redirectTo: "/billing/success" };
}

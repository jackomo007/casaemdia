import "server-only";

import { subscriptionPlans } from "@/lib/constants/plans";
import { getWorkspaceSession } from "@/lib/auth/session";
import {
  activatePlan,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { PlanCode } from "@/types";

export async function getPlanCatalog() {
  return subscriptionPlans;
}

export async function getBillingState() {
  const session = await getWorkspaceSession();
  return getWorkspaceSnapshot(session).billing;
}

export async function activateSubscriptionPlan(planCode: PlanCode) {
  const session = await getWorkspaceSession();
  return activatePlan(session, planCode).billing;
}

import "server-only";

import { subscriptionPlans } from "@/lib/constants/plans";
import { getSessionScenario } from "@/lib/auth/session";
import {
  activatePlan,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { PlanCode } from "@/types";

export async function getPlanCatalog() {
  return subscriptionPlans;
}

export async function getBillingState() {
  const scenario = await getSessionScenario();
  return getWorkspaceSnapshot(scenario).billing;
}

export async function activateSubscriptionPlan(planCode: PlanCode) {
  const scenario = await getSessionScenario();
  return activatePlan(scenario, planCode).billing;
}

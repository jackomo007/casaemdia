import "server-only";

import { getSessionScenario } from "@/lib/auth/session";
import {
  addFinanceEntry,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { CreateFinanceEntryInput } from "@/types";

export async function getFinanceOverview() {
  const scenario = await getSessionScenario();
  return getWorkspaceSnapshot(scenario).finance;
}

export async function createFinanceEntry(input: CreateFinanceEntryInput) {
  const scenario = await getSessionScenario();
  return addFinanceEntry(scenario, input).finance;
}

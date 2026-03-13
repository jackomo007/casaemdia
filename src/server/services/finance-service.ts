import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import {
  addFinanceEntry,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { CreateFinanceEntryInput } from "@/types";

export async function getFinanceOverview() {
  const session = await getWorkspaceSession();
  return getWorkspaceSnapshot(session).finance;
}

export async function createFinanceEntry(input: CreateFinanceEntryInput) {
  const session = await getWorkspaceSession();
  return addFinanceEntry(session, input).finance;
}

export async function createFinanceEntries(inputs: CreateFinanceEntryInput[]) {
  const session = await getWorkspaceSession();

  for (const input of inputs) {
    addFinanceEntry(session, input);
  }

  return getWorkspaceSnapshot(session).finance;
}

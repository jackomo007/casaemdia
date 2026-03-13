import "server-only";

import { getSessionScenario } from "@/lib/auth/session";
import { getWorkspaceSnapshot } from "@/server/repositories/demo-store";

export async function getHealthReminders() {
  const scenario = await getSessionScenario();
  return getWorkspaceSnapshot(scenario).health;
}

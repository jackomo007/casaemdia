import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import { getWorkspaceSnapshot } from "@/server/repositories/demo-store";

export async function getAIInsights() {
  const session = await getWorkspaceSession();
  return getWorkspaceSnapshot(session).insights;
}

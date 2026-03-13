import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import { getWorkspaceSnapshot } from "@/server/repositories/demo-store";

function getFirstName(fullName?: string | null) {
  return fullName?.trim().split(/\s+/)[0] || null;
}

export async function getDashboardData() {
  const session = await getWorkspaceSession();
  const dashboard = getWorkspaceSnapshot(session).dashboard;
  const greetingName = getFirstName(session.user?.fullName);

  if (!greetingName) {
    return dashboard;
  }

  return {
    ...dashboard,
    greetingName,
  };
}

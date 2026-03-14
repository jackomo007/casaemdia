import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { provisionUserWorkspace } from "@/server/services/account-provisioning-service";

export async function getCurrentWorkspace() {
  const session = await getWorkspaceSession();

  if (
    session.workspacePreset === "sample" ||
    !session.user?.email ||
    !isDatabaseConfigured()
  ) {
    return {
      session,
      workspace: null,
    };
  }

  const workspace = await provisionUserWorkspace({
    email: session.user.email,
    fullName: session.user.fullName,
  });

  return {
    session,
    workspace,
  };
}

import "server-only";

import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { provisionUserWorkspace } from "@/server/services/account-provisioning-service";

type AuditInput = {
  email?: string | null;
  fullName?: string | null;
  supabaseUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

async function getRequestIpAddress() {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip")?.trim() ||
    null
  );
}

export async function recordAuditEvent(input: AuditInput) {
  if (!isDatabaseConfigured() || !input.email) {
    return;
  }

  const workspace = await provisionUserWorkspace({
    email: input.email,
    fullName: input.fullName,
    supabaseUserId: input.supabaseUserId,
  });

  if (!workspace) {
    return;
  }

  await prisma.auditLog.create({
    data: {
      householdId: workspace.household.id,
      actorUserId: workspace.user.id,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: await getRequestIpAddress(),
    },
  });
}

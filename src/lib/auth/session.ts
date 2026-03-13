import "server-only";

import { cookies } from "next/headers";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";

import {
  DEMO_SESSION_COOKIE,
  SESSION_USER_COOKIE,
  WORKSPACE_PRESET_COOKIE,
} from "@/lib/constants/app";
import { getDemoAccessState } from "@/server/repositories/demo-data";
import type { AccessState, SessionUser, WorkspacePreset } from "@/types";

function deriveNameFromEmail(email: string): string {
  const [localPart = "Familia"] = email.split("@");

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function serializeSessionUser(user: SessionUser): string {
  return encodeURIComponent(JSON.stringify(user));
}

function parseSessionUser(value?: string | null): SessionUser | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (
      typeof parsed?.fullName === "string" &&
      parsed.fullName &&
      typeof parsed?.email === "string" &&
      parsed.email
    ) {
      return {
        fullName: parsed.fullName,
        email: parsed.email,
      };
    }
  } catch {}

  return null;
}

export function normalizeWorkspacePreset(
  value?: string | null,
): WorkspacePreset {
  if (value === "blank") {
    return "blank";
  }

  return "blank";
}

export async function getIsAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(DEMO_SESSION_COOKIE)?.value);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  const storedUser = parseSessionUser(
    cookieStore.get(SESSION_USER_COOKIE)?.value,
  );

  if (storedUser) {
    return storedUser;
  }

  if (!email) {
    return null;
  }

  return {
    email,
    fullName: deriveNameFromEmail(email),
  };
}

export async function getSessionWorkspacePreset(): Promise<WorkspacePreset> {
  const cookieStore = await cookies();
  return normalizeWorkspacePreset(
    cookieStore.get(WORKSPACE_PRESET_COOKIE)?.value,
  );
}

export async function getSessionWorkspaceKey(): Promise<string> {
  const [user, preset] = await Promise.all([
    getSessionUser(),
    getSessionWorkspacePreset(),
  ]);

  const emailKey = user?.email?.toLowerCase() ?? "guest";
  return `${preset}:${emailKey}`;
}

export async function getAccessStateForEmail(
  email?: string | null,
): Promise<AccessState> {
  if (!email) {
    return {
      scenario: "expired",
      status: "INCOMPLETE",
      hasAccess: false,
      blockedReason: "Faça login para continuar.",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isDatabaseConfigured()) {
    return getDemoAccessState("expired");
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      ownedHouseholds: {
        select: { id: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
      roles: {
        select: { householdId: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  const householdId =
    user?.ownedHouseholds[0]?.id ?? user?.roles[0]?.householdId ?? null;

  if (!user || !householdId) {
    return {
      scenario: "expired",
      status: "EXPIRED",
      hasAccess: false,
      blockedReason:
        "Não encontramos um acesso válido para esta conta neste momento.",
    };
  }

  const [subscription, trialAccess] = await Promise.all([
    prisma.subscription.findFirst({
      where: { householdId },
      orderBy: [{ currentPeriodEnd: "desc" }, { createdAt: "desc" }],
    }),
    prisma.trialAccess.findFirst({
      where: {
        householdId,
        emailNormalized: normalizedEmail,
      },
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  const now = new Date();

  if (subscription) {
    if (
      subscription.status === "ACTIVE" &&
      (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > now)
    ) {
      return {
        scenario: "active",
        status: "ACTIVE",
        hasAccess: true,
      };
    }

    if (subscription.status === "PAST_DUE") {
      return {
        scenario: "past_due",
        status: "PAST_DUE",
        hasAccess: false,
        blockedReason:
          "Existe um pagamento pendente. Regularize a assinatura para voltar a entrar.",
      };
    }

    return {
      scenario: "expired",
      status:
        subscription.status === "CANCELED"
          ? "CANCELED"
          : subscription.status === "INCOMPLETE"
            ? "INCOMPLETE"
            : "EXPIRED",
      hasAccess: false,
      blockedReason:
        "O acesso desta conta está encerrado até a assinatura ser regularizada.",
    };
  }

  if (
    trialAccess &&
    !trialAccess.expiredAt &&
    !trialAccess.convertedToPaidAt &&
    trialAccess.endsAt > now
  ) {
    return {
      scenario: "trialing",
      status: "TRIALING",
      hasAccess: true,
      trialEndsAt: trialAccess.endsAt.toISOString(),
    };
  }

  return {
    scenario: "expired",
    status: "EXPIRED",
    hasAccess: false,
    blockedReason:
      "O período de teste terminou ou a assinatura ainda não está ativa.",
    trialEndsAt: trialAccess?.endsAt?.toISOString(),
  };
}

export async function getWorkspaceSession() {
  const [user, workspacePreset, workspaceKey] = await Promise.all([
    getSessionUser(),
    getSessionWorkspacePreset(),
    getSessionWorkspaceKey(),
  ]);
  const access = await getAccessStateForEmail(user?.email);

  return {
    scenario: access.scenario,
    user,
    workspacePreset,
    workspaceKey,
  };
}

export async function getAccessState(): Promise<AccessState> {
  const user = await getSessionUser();
  return getAccessStateForEmail(user?.email);
}

export async function getSessionContext() {
  const authenticated = await getIsAuthenticated();
  const access = await getAccessState();
  const user = authenticated ? await getSessionUser() : null;

  return {
    authenticated,
    access,
    user,
  };
}

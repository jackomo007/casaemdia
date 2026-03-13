import "server-only";

import { cookies } from "next/headers";

import {
  DEMO_SCENARIO_COOKIE,
  DEMO_SESSION_COOKIE,
  SESSION_USER_COOKIE,
  WORKSPACE_PRESET_COOKIE,
} from "@/lib/constants/app";
import { getDemoAccessState } from "@/server/repositories/demo-data";
import type {
  AccessState,
  DemoScenario,
  SessionUser,
  WorkspacePreset,
} from "@/types";

const validScenarios: DemoScenario[] = [
  "trialing",
  "active",
  "expired",
  "past_due",
];
const validPresets: WorkspacePreset[] = ["sample", "blank"];

export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== "false";
}

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

export function normalizeScenario(value?: string | null): DemoScenario {
  if (value && validScenarios.includes(value as DemoScenario)) {
    return value as DemoScenario;
  }

  return "trialing";
}

export async function getSessionScenario(): Promise<DemoScenario> {
  const cookieStore = await cookies();
  return normalizeScenario(cookieStore.get(DEMO_SCENARIO_COOKIE)?.value);
}

export function normalizeWorkspacePreset(
  value?: string | null,
  email?: string | null,
): WorkspacePreset {
  if (value && validPresets.includes(value as WorkspacePreset)) {
    return value as WorkspacePreset;
  }

  return email === "marina@familiaoliveira.com.br" ? "sample" : "blank";
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
    fullName:
      email === "marina@familiaoliveira.com.br"
        ? "Marina Oliveira"
        : deriveNameFromEmail(email),
  };
}

export async function getSessionWorkspacePreset(): Promise<WorkspacePreset> {
  const cookieStore = await cookies();
  const email = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  return normalizeWorkspacePreset(
    cookieStore.get(WORKSPACE_PRESET_COOKIE)?.value,
    email,
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

export async function getWorkspaceSession() {
  const [scenario, user, workspacePreset, workspaceKey] = await Promise.all([
    getSessionScenario(),
    getSessionUser(),
    getSessionWorkspacePreset(),
    getSessionWorkspaceKey(),
  ]);

  return {
    scenario,
    user,
    workspacePreset,
    workspaceKey,
  };
}

export async function getAccessState(): Promise<AccessState> {
  const scenario = await getSessionScenario();
  return getDemoAccessState(scenario);
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

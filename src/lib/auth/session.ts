import "server-only";

import { cookies } from "next/headers";

import { DEMO_SCENARIO_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/constants/app";
import { getDemoAccessState } from "@/server/repositories/demo-data";
import type { AccessState, DemoScenario } from "@/types";

const validScenarios: DemoScenario[] = [
  "trialing",
  "active",
  "expired",
  "past_due",
];

export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== "false";
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

export async function getIsAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(DEMO_SESSION_COOKIE)?.value);
}

export async function getAccessState(): Promise<AccessState> {
  const scenario = await getSessionScenario();
  return getDemoAccessState(scenario);
}

export async function getSessionContext() {
  const authenticated = await getIsAuthenticated();
  const access = await getAccessState();

  return {
    authenticated,
    access,
    user: authenticated
      ? {
          fullName: "Marina Oliveira",
          email: "marina@familiaoliveira.com.br",
        }
      : null,
  };
}

import "server-only";

import { getSessionScenario } from "@/lib/auth/session";
import {
  addCalendarEvent,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { CreateCalendarEventInput } from "@/types";

export async function getCalendarEvents() {
  const scenario = await getSessionScenario();
  return getWorkspaceSnapshot(scenario).events;
}

export async function createCalendarEvent(input: CreateCalendarEventInput) {
  const scenario = await getSessionScenario();
  return addCalendarEvent(scenario, input).events;
}

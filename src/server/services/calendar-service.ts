import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import {
  addCalendarEvent,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { CreateCalendarEventInput } from "@/types";

export async function getCalendarEvents() {
  const session = await getWorkspaceSession();
  return getWorkspaceSnapshot(session).events;
}

export async function createCalendarEvent(input: CreateCalendarEventInput) {
  const session = await getWorkspaceSession();
  return addCalendarEvent(session, input).events;
}

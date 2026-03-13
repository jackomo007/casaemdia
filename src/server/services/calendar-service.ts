import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import {
  addCalendarEvent,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type {
  CalendarEventItem,
  CreateCalendarEventInput,
  HealthReminder,
  HouseholdWorkspace,
  TaskItem,
} from "@/types";

function mapTaskToAgendaItem(task: TaskItem): CalendarEventItem {
  return {
    id: `agenda-task-${task.id}`,
    title: task.title,
    description: task.description,
    startsAt: task.dueDate,
    kind: "task",
    priority: task.priority,
  };
}

function mapHealthReminderToAgendaItem(
  reminder: HealthReminder,
): CalendarEventItem {
  return {
    id: `agenda-health-${reminder.id}`,
    title: reminder.title,
    description: reminder.description,
    startsAt: reminder.dueDate,
    kind: "medical",
    priority: "medium",
  };
}

export function buildAgendaItems(
  workspace: Pick<HouseholdWorkspace, "events" | "tasks" | "health">,
) {
  return [
    ...workspace.events.map((event) => ({
      ...event,
      priority: event.priority ?? "medium",
    })),
    ...workspace.tasks.map(mapTaskToAgendaItem),
    ...workspace.health.map(mapHealthReminderToAgendaItem),
  ].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export async function getCalendarEvents() {
  const session = await getWorkspaceSession();
  return buildAgendaItems(getWorkspaceSnapshot(session));
}

export async function createCalendarEvent(input: CreateCalendarEventInput) {
  const session = await getWorkspaceSession();
  return addCalendarEvent(session, input).events;
}

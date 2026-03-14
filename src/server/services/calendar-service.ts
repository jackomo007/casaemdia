import "server-only";

import { prisma } from "@/lib/db/prisma";
import {
  addCalendarEvent,
  getWorkspaceSnapshot,
  removeCalendarEvent,
} from "@/server/repositories/demo-store";
import { getCurrentWorkspace } from "@/server/services/current-workspace-service";
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
    description: "",
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
    description: "",
    startsAt: reminder.dueDate,
    kind: "medical",
    priority: "medium",
  };
}

function mapDbTypeToKind(type: string): CalendarEventItem["kind"] {
  if (type === "SCHOOL") {
    return "school";
  }

  if (type === "MEDICAL") {
    return "medical";
  }

  if (type === "BILLING") {
    return "billing";
  }

  if (type === "FAMILY") {
    return "family";
  }

  return "task";
}

function mapKindToDbType(kind: CreateCalendarEventInput["kind"]) {
  if (kind === "school") {
    return "SCHOOL" as const;
  }

  if (kind === "medical") {
    return "MEDICAL" as const;
  }

  if (kind === "billing") {
    return "BILLING" as const;
  }

  if (kind === "family") {
    return "FAMILY" as const;
  }

  return "HOUSEHOLD" as const;
}

function mapPriorityForDbItem(type: string): CalendarEventItem["priority"] {
  if (type === "BILLING") {
    return "high";
  }

  if (type === "FAMILY") {
    return "low";
  }

  return "medium";
}

export function buildAgendaItems(
  workspace: Pick<HouseholdWorkspace, "events" | "tasks" | "health">,
) {
  return [
    ...workspace.events.map((event) => ({
      ...event,
      description: "",
      priority: event.priority ?? "medium",
      canDelete: true,
    })),
    ...workspace.tasks.map(mapTaskToAgendaItem),
    ...workspace.health.map(mapHealthReminderToAgendaItem),
  ].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

async function getDatabaseCalendarEvents(householdId: string) {
  const events = await prisma.calendarEvent.findMany({
    where: { householdId },
    orderBy: [{ startsAt: "asc" }],
  });

  return events.map(
    (event): CalendarEventItem => ({
      id: event.id,
      title: event.title,
      description: "",
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt?.toISOString(),
      location: event.location ?? undefined,
      kind: mapDbTypeToKind(event.type),
      priority: mapPriorityForDbItem(event.type),
      canDelete: true,
    }),
  );
}

export async function getCalendarEvents() {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return buildAgendaItems(getWorkspaceSnapshot(session));
  }

  return getDatabaseCalendarEvents(workspace.household.id);
}

export async function createCalendarEvent(input: CreateCalendarEventInput) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    addCalendarEvent(session, input);
    return buildAgendaItems(getWorkspaceSnapshot(session));
  }

  await prisma.calendarEvent.create({
    data: {
      householdId: workspace.household.id,
      title: input.title.trim(),
      description: null,
      startsAt: new Date(input.startsAt),
      type: mapKindToDbType(input.kind),
    },
  });

  return getDatabaseCalendarEvents(workspace.household.id);
}

export async function deleteCalendarEvent(id: string) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    removeCalendarEvent(session, id);
    return buildAgendaItems(getWorkspaceSnapshot(session));
  }

  await prisma.calendarEvent.deleteMany({
    where: {
      id,
      householdId: workspace.household.id,
    },
  });

  return getDatabaseCalendarEvents(workspace.household.id);
}

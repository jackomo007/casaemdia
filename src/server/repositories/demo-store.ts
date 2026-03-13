import type {
  CreateCalendarEventInput,
  CreateFinanceEntryInput,
  CreateTaskInput,
  DemoScenario,
  HouseholdWorkspace,
} from "@/types";
import { getDemoWorkspace } from "@/server/repositories/demo-data";

type DemoStore = Record<DemoScenario, HouseholdWorkspace>;

const store: DemoStore = {
  trialing: structuredClone(getDemoWorkspace("trialing")),
  active: structuredClone(getDemoWorkspace("active")),
  expired: structuredClone(getDemoWorkspace("expired")),
  past_due: structuredClone(getDemoWorkspace("past_due")),
};

export function getWorkspaceSnapshot(
  scenario: DemoScenario,
): HouseholdWorkspace {
  return store[scenario];
}

export function addFinanceEntry(
  scenario: DemoScenario,
  input: CreateFinanceEntryInput,
): HouseholdWorkspace {
  const workspace = store[scenario];
  const entry = {
    id: `entry-${Date.now()}`,
    title: input.title,
    amount: input.amount,
    kind: input.kind,
    category: input.category,
    member: input.member,
    dueDate: input.dueDate,
    competenceDate: input.competenceDate,
    status: "pending" as const,
    account: input.account,
  };

  workspace.finance.entries = [entry, ...workspace.finance.entries];

  if (input.kind === "expense") {
    workspace.finance.summary.expense += input.amount;
    workspace.dashboard.finance.expense += input.amount;
  } else {
    workspace.finance.summary.income += input.amount;
    workspace.dashboard.finance.income += input.amount;
  }

  workspace.finance.summary.balance =
    workspace.finance.summary.income - workspace.finance.summary.expense;
  workspace.dashboard.finance.balance = workspace.finance.summary.balance;

  return workspace;
}

export function addCalendarEvent(
  scenario: DemoScenario,
  input: CreateCalendarEventInput,
): HouseholdWorkspace {
  const workspace = store[scenario];
  const event = {
    id: `event-${Date.now()}`,
    title: input.title,
    description: input.description,
    startsAt: input.startsAt,
    kind: input.kind,
    badge: input.badge,
    childName: input.childName,
  };

  workspace.events = [event, ...workspace.events].sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
  workspace.dashboard.upcomingEvents = workspace.events.slice(0, 3);
  workspace.dashboard.nextSevenDays = workspace.events.slice(0, 6);

  return workspace;
}

export function addTask(
  scenario: DemoScenario,
  input: CreateTaskInput,
): HouseholdWorkspace {
  const workspace = store[scenario];
  const task = {
    id: `task-${Date.now()}`,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    priority: input.priority,
    status: "todo" as const,
    assignee: input.assignee,
    points: input.points,
    subtasksDone: 0,
    subtasksTotal: 1,
  };

  workspace.tasks = [task, ...workspace.tasks];
  workspace.dashboard.pendingTasks = workspace.tasks.slice(0, 4);

  return workspace;
}

export function activatePlan(
  scenario: DemoScenario,
  planCode: string,
): HouseholdWorkspace {
  const workspace = store[scenario];

  workspace.billing = {
    ...workspace.billing,
    status: "ACTIVE",
    planCode: planCode === "FAMILY_AI" ? "FAMILY_AI" : "FAMILY",
    planName: planCode === "FAMILY_AI" ? "Mensal Familia IA" : "Mensal Familia",
    renewalLabel: "Renovacao automatica em 10 de abril",
    currentPeriodEnd: "2026-04-10T12:00:00.000Z",
    history: [
      {
        id: `billing-${Date.now()}`,
        label: `Ativacao ${planCode}`,
        amount: planCode === "FAMILY_AI" ? 39.9 : 29.9,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      ...workspace.billing.history,
    ],
  };

  return workspace;
}

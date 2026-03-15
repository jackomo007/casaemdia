import type {
  CreateCalendarEventInput,
  CreateFinanceEntryInput,
  CreateShoppingListInput,
  CreateShoppingListItemInput,
  CreateTaskInput,
  DemoScenario,
  FinanceEntry,
  FinanceOverviewData,
  HouseholdWorkspace,
  SessionUser,
  SyncFinanceMonthInput,
  UpdateShoppingListItemStatusInput,
  WorkspacePreset,
} from "@/types";
import {
  getCurrentMonthKey,
  getMonthKeyFromDateValue,
  toDateOnly,
} from "@/lib/utils/date";
import {
  createBlankWorkspace,
  getDemoWorkspace,
} from "@/server/repositories/demo-data";

type DemoStoreContext = {
  scenario: DemoScenario;
  workspaceKey: string;
  workspacePreset: WorkspacePreset;
  user: SessionUser | null;
};

const store = new Map<string, HouseholdWorkspace>();

function getStoreKey({
  scenario,
  workspaceKey,
}: Pick<DemoStoreContext, "scenario" | "workspaceKey">) {
  return `${workspaceKey}:${scenario}`;
}

function createWorkspace({
  scenario,
  workspacePreset,
  user,
}: Omit<DemoStoreContext, "workspaceKey">) {
  const baseWorkspace =
    workspacePreset === "sample"
      ? getDemoWorkspace(scenario)
      : createBlankWorkspace(user ?? undefined, scenario);

  return structuredClone(baseWorkspace);
}

function getWorkspace(context: DemoStoreContext): HouseholdWorkspace {
  const key = getStoreKey(context);
  const existingWorkspace = store.get(key);

  if (existingWorkspace) {
    return existingWorkspace;
  }

  const workspace = createWorkspace(context);
  store.set(key, workspace);

  return workspace;
}

function getFinanceMonthLabel(value: string) {
  const [year, month] = getMonthKeyFromDateValue(value).split("-");
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(new Date(Number(year), Number(month) - 1, 1));

  const normalized = formatted.replace(".", "");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1, 3);
}

function formatCurrencyValue(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function buildFinanceOverview(entries: FinanceEntry[]): FinanceOverviewData {
  const currentMonthKey = getMonthKeyFromDateValue(new Date().toISOString());
  const currentMonthEntries = entries.filter(
    (entry) =>
      getMonthKeyFromDateValue(entry.competenceDate || entry.dueDate) ===
      currentMonthKey,
  );
  const income = currentMonthEntries
    .filter((entry) => entry.kind === "income")
    .reduce((total, entry) => total + entry.amount, 0);
  const expense = currentMonthEntries
    .filter((entry) => entry.kind === "expense")
    .reduce((total, entry) => total + entry.amount, 0);
  const balance = income - expense;
  const expenseGroups = new Map<string, number>();

  currentMonthEntries
    .filter((entry) => entry.kind === "expense")
    .forEach((entry) => {
      expenseGroups.set(
        entry.category,
        (expenseGroups.get(entry.category) ?? 0) + entry.amount,
      );
    });

  const categoryBreakdown = Array.from(expenseGroups.entries())
    .map(([name, amount]) => ({
      id: `cat-${slugify(name)}`,
      name,
      amount,
      percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
    }))
    .sort((left, right) => right.amount - left.amount);

  const monthlyMap = new Map<
    string,
    { label: string; income: number; expense: number; balance: number }
  >();

  entries.forEach((entry) => {
    const monthKey = getMonthKeyFromDateValue(
      entry.competenceDate || entry.dueDate,
    );
    const current = monthlyMap.get(monthKey) ?? {
      label: getFinanceMonthLabel(monthKey),
      income: 0,
      expense: 0,
      balance: 0,
    };

    if (entry.kind === "income") {
      current.income += entry.amount;
    } else {
      current.expense += entry.amount;
    }

    current.balance = current.income - current.expense;
    monthlyMap.set(monthKey, current);
  });

  return {
    summary: {
      income,
      expense,
      balance,
      forecast: balance,
      fixedCostRatio: income > 0 ? Math.round((expense / income) * 100) : 0,
    },
    entries: [...entries].sort((left, right) =>
      (right.dueDate || right.competenceDate).localeCompare(
        left.dueDate || left.competenceDate,
      ),
    ),
    categoryBreakdown,
    monthlyFlow: Array.from(monthlyMap.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, value]) => value),
  };
}

function refreshFinanceSnapshots(workspace: HouseholdWorkspace) {
  workspace.finance = buildFinanceOverview(workspace.finance.entries);
  workspace.dashboard.finance = workspace.finance.summary;
}

function hydrateShoppingList(
  list: HouseholdWorkspace["shoppingLists"][number],
): HouseholdWorkspace["shoppingLists"][number] {
  const itemCount = list.items.length;
  const completedItems = list.items.filter((item) => item.checked).length;
  const estimatedFromItems = list.items.reduce(
    (total, item) => total + item.estimatedCost,
    0,
  );

  return {
    ...list,
    estimatedTotal:
      list.estimatedTotal > 0 ? list.estimatedTotal : estimatedFromItems,
    itemCount,
    completedItems,
    progress:
      itemCount > 0 ? Math.round((completedItems / itemCount) * 100) : 0,
  };
}

function refreshShoppingSnapshots(workspace: HouseholdWorkspace) {
  workspace.shoppingLists = workspace.shoppingLists.map(hydrateShoppingList);

  const currentMonth = getCurrentMonthKey();
  const currentMonthLists = workspace.shoppingLists
    .filter((list) => list.monthKey === currentMonth)
    .sort((left, right) => right.estimatedTotal - left.estimatedTotal);
  const openTotal = currentMonthLists
    .filter((list) => list.progress < 100)
    .reduce((total, list) => total + list.estimatedTotal, 0);
  const shoppingMetric = workspace.dashboard.metrics.find(
    (metric) => metric.id === "metric-shopping",
  );

  workspace.dashboard.shoppingLists = currentMonthLists.slice(0, 4);

  if (shoppingMetric) {
    shoppingMetric.value = formatCurrencyValue(openTotal);
    shoppingMetric.helper = currentMonthLists.length
      ? `${currentMonthLists.filter((list) => list.progress < 100).length} lista(s) ativa(s) neste mês.`
      : "Nenhuma lista de compras ativa.";
    shoppingMetric.trend = currentMonthLists.length ? "up" : "neutral";
  }
}

function getMonthDate(monthKey: string, day: number) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const safeDay = Math.min(day, lastDayOfMonth);

  return `${yearValue}-${monthValue}-${String(safeDay).padStart(2, "0")}`;
}

function getMonthStart(monthKey: string) {
  return `${monthKey}-01`;
}

function getMonthDay(dateValue: string) {
  const [, , day] = toDateOnly(dateValue).split("-");
  return Number(day);
}

function getYearMonthKeys(year: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
}

function getFilledMonthKeysInYear(entries: FinanceEntry[], year: number) {
  return new Set(
    entries
      .map((entry) =>
        getMonthKeyFromDateValue(entry.competenceDate || entry.dueDate),
      )
      .filter((monthKey) => monthKey.startsWith(`${year}-`)),
  );
}

function upsertMonthlyFlowEntry(
  workspace: HouseholdWorkspace,
  input: CreateFinanceEntryInput,
) {
  const monthLabel = getFinanceMonthLabel(
    input.competenceDate || input.dueDate,
  );
  const existingPoint = workspace.finance.monthlyFlow.find(
    (point) => point.label === monthLabel,
  );

  if (existingPoint) {
    if (input.kind === "expense") {
      existingPoint.expense += input.amount;
    } else {
      existingPoint.income += input.amount;
    }

    existingPoint.balance = existingPoint.income - existingPoint.expense;
    return;
  }

  workspace.finance.monthlyFlow = [
    ...workspace.finance.monthlyFlow,
    {
      label: monthLabel,
      income: input.kind === "income" ? input.amount : 0,
      expense: input.kind === "expense" ? input.amount : 0,
      balance: input.kind === "income" ? input.amount : -input.amount,
    },
  ];
}

export function getWorkspaceSnapshot(
  context: DemoStoreContext,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
  refreshShoppingSnapshots(workspace);
  return workspace;
}

export function addFinanceEntry(
  context: DemoStoreContext,
  input: CreateFinanceEntryInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
  const entry = {
    id: `entry-${Date.now()}`,
    title: input.title,
    amount: input.amount,
    kind: input.kind,
    category: input.category,
    member: input.member,
    dueDate: toDateOnly(input.dueDate),
    competenceDate: toDateOnly(input.competenceDate),
    paymentDate: input.paymentDate,
    status: input.status ?? ("pending" as const),
    account: input.account,
    isFixed: input.isFixed,
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
  upsertMonthlyFlowEntry(workspace, input);

  return workspace;
}

export function replaceFinanceMonthEntries(
  context: DemoStoreContext,
  input: SyncFinanceMonthInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
  const [yearValue] = input.monthKey.split("-");
  const year = Number(yearValue);
  const filledMonthKeys = getFilledMonthKeysInYear(
    workspace.finance.entries,
    year,
  );
  const shouldCopyToEmptyMonths =
    input.copyToEmptyMonths === true &&
    (filledMonthKeys.size === 0 ||
      (filledMonthKeys.size === 1 && filledMonthKeys.has(input.monthKey)));
  const targetMonths = shouldCopyToEmptyMonths
    ? getYearMonthKeys(year).filter(
        (monthKey) =>
          monthKey === input.monthKey || !filledMonthKeys.has(monthKey),
      )
    : [input.monthKey];
  const remainingEntries = workspace.finance.entries.filter(
    (entry) =>
      !targetMonths.includes(
        getMonthKeyFromDateValue(entry.competenceDate || entry.dueDate),
      ),
  );

  const syncedEntries = targetMonths.flatMap((monthKey) =>
    input.rows.map((row, index) => ({
      id: row.id ?? `entry-${monthKey}-${index}-${Date.now()}`,
      title: row.title,
      amount: row.amount,
      kind:
        row.section === "income" ? ("income" as const) : ("expense" as const),
      category: row.category,
      member: row.member,
      dueDate: getMonthDate(monthKey, getMonthDay(row.dueDate)),
      competenceDate: getMonthStart(monthKey),
      paymentDate:
        monthKey === input.monthKey && row.status === "paid"
          ? row.paymentDate
          : undefined,
      status: monthKey === input.monthKey ? row.status : "pending",
      account: row.account,
      isFixed: row.section === "fixed",
    })),
  );

  workspace.finance.entries = [...remainingEntries, ...syncedEntries];
  refreshFinanceSnapshots(workspace);

  return workspace;
}

export function removeFinanceEntry(
  context: DemoStoreContext,
  id: string,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
  const entryToRemove = workspace.finance.entries.find(
    (entry) => entry.id === id,
  );

  if (!entryToRemove) {
    return workspace;
  }

  workspace.finance.entries = workspace.finance.entries.filter(
    (entry) => entry.id !== id,
  );

  if (entryToRemove.kind === "expense") {
    workspace.finance.summary.expense -= entryToRemove.amount;
    workspace.dashboard.finance.expense -= entryToRemove.amount;
  } else {
    workspace.finance.summary.income -= entryToRemove.amount;
    workspace.dashboard.finance.income -= entryToRemove.amount;
  }

  workspace.finance.summary.balance =
    workspace.finance.summary.income - workspace.finance.summary.expense;
  workspace.dashboard.finance.balance = workspace.finance.summary.balance;
  workspace.finance.monthlyFlow = workspace.finance.monthlyFlow
    .map((point) =>
      point.label ===
      getFinanceMonthLabel(
        entryToRemove.competenceDate || entryToRemove.dueDate,
      )
        ? {
            ...point,
            income:
              entryToRemove.kind === "income"
                ? point.income - entryToRemove.amount
                : point.income,
            expense:
              entryToRemove.kind === "expense"
                ? point.expense - entryToRemove.amount
                : point.expense,
          }
        : point,
    )
    .map((point) => ({
      ...point,
      balance: point.income - point.expense,
    }))
    .filter((point) => point.income > 0 || point.expense > 0);

  return workspace;
}

export function addCalendarEvent(
  context: DemoStoreContext,
  input: CreateCalendarEventInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
  const event = {
    id: `event-${Date.now()}`,
    title: input.title,
    description: input.description,
    startsAt: input.startsAt,
    kind: input.kind,
    priority: input.priority,
  };

  workspace.events = [event, ...workspace.events].sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
  workspace.dashboard.upcomingEvents = workspace.events.slice(0, 3);
  workspace.dashboard.nextSevenDays = workspace.events.slice(0, 6);

  return workspace;
}

export function removeCalendarEvent(
  context: DemoStoreContext,
  id: string,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

  workspace.events = workspace.events.filter((event) => event.id !== id);
  workspace.dashboard.upcomingEvents = workspace.events.slice(0, 3);
  workspace.dashboard.nextSevenDays = workspace.events.slice(0, 6);

  return workspace;
}

export function updateFinanceEntryStatus(
  context: DemoStoreContext,
  input: { id: string; status: "paid" | "pending" | "overdue" },
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

  workspace.finance.entries = workspace.finance.entries.map((entry) =>
    entry.id === input.id
      ? {
          ...entry,
          status: input.status,
          paymentDate:
            input.status === "paid" ? new Date().toISOString() : undefined,
        }
      : entry,
  );

  return workspace;
}

export function addTask(
  context: DemoStoreContext,
  input: CreateTaskInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
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

export function addShoppingList(
  context: DemoStoreContext,
  input: CreateShoppingListInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);
  const shoppingList = hydrateShoppingList({
    id: `shopping-${Date.now()}`,
    title: input.title,
    category: input.category,
    description: input.description?.trim() || undefined,
    kind: input.kind,
    monthKey: input.monthKey,
    estimatedTotal: input.estimatedTotal ?? 0,
    progress: 0,
    itemCount: 0,
    completedItems: 0,
    items: [],
  });

  workspace.shoppingLists = [shoppingList, ...workspace.shoppingLists].sort(
    (left, right) =>
      right.monthKey.localeCompare(left.monthKey) ||
      right.title.localeCompare(left.title),
  );
  refreshShoppingSnapshots(workspace);

  return workspace;
}

export function addShoppingListItem(
  context: DemoStoreContext,
  input: CreateShoppingListItemInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

  workspace.shoppingLists = workspace.shoppingLists.map((list) =>
    list.id === input.shoppingListId
      ? hydrateShoppingList({
          ...list,
          items: [
            ...list.items,
            {
              id: `shopping-item-${Date.now()}`,
              name: input.name,
              quantity: input.quantity?.trim() || "1 item",
              estimatedCost: input.estimatedCost ?? 0,
              checked: false,
            },
          ],
        })
      : list,
  );
  refreshShoppingSnapshots(workspace);

  return workspace;
}

export function updateShoppingItemStatus(
  context: DemoStoreContext,
  input: UpdateShoppingListItemStatusInput,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

  workspace.shoppingLists = workspace.shoppingLists.map((list) =>
    hydrateShoppingList({
      ...list,
      items: list.items.map((item) =>
        item.id === input.id ? { ...item, checked: input.checked } : item,
      ),
    }),
  );
  refreshShoppingSnapshots(workspace);

  return workspace;
}

export function removeShoppingList(
  context: DemoStoreContext,
  id: string,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

  workspace.shoppingLists = workspace.shoppingLists.filter(
    (list) => list.id !== id,
  );
  refreshShoppingSnapshots(workspace);

  return workspace;
}

export function removeShoppingListItem(
  context: DemoStoreContext,
  id: string,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

  workspace.shoppingLists = workspace.shoppingLists.map((list) =>
    hydrateShoppingList({
      ...list,
      items: list.items.filter((item) => item.id !== id),
    }),
  );
  refreshShoppingSnapshots(workspace);

  return workspace;
}

export function activatePlan(
  context: DemoStoreContext,
  planCode: string,
): HouseholdWorkspace {
  const workspace = getWorkspace(context);

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

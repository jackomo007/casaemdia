import "server-only";

import { prisma } from "@/lib/db/prisma";
import {
  getCurrentMonthKey,
  getMonthKeyFromDateValue,
  toDateOnly,
} from "@/lib/utils/date";
import {
  addFinanceEntry,
  getWorkspaceSnapshot,
  replaceFinanceMonthEntries,
  removeFinanceEntry,
  updateFinanceEntryStatus,
} from "@/server/repositories/demo-store";
import { getCurrentWorkspace } from "@/server/services/current-workspace-service";
import type {
  CreateFinanceEntryInput,
  FinanceEntry,
  FinanceOverviewData,
  FinancialStatus,
  SyncFinanceMonthInput,
} from "@/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(date);

  const normalized = formatted.replace(".", "");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1, 3);
}

function mapEntryStatus(
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELED",
): FinancialStatus {
  if (status === "PAID") {
    return "paid";
  }

  if (status === "OVERDUE") {
    return "overdue";
  }

  return "pending";
}

function mapStatusToDb(status: FinancialStatus) {
  if (status === "paid") {
    return "PAID" as const;
  }

  if (status === "overdue") {
    return "OVERDUE" as const;
  }

  return "PENDING" as const;
}

function getMonthRange(monthKey: string) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return { start, end };
}

function getYearRange(year: number) {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year + 1, 0, 1),
  };
}

function getMonthDay(dateValue: string) {
  const [, , day] = toDateOnly(dateValue).split("-");
  return Number(day);
}

function getMonthStart(monthKey: string) {
  return `${monthKey}-01`;
}

function getMonthDate(monthKey: string, day: number) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const safeDay = Math.min(day, lastDayOfMonth);

  return `${yearValue}-${monthValue}-${String(safeDay).padStart(2, "0")}`;
}

function getYearMonthKeys(year: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
}

async function getFilledMonthKeysInYear(householdId: string, year: number) {
  const { start, end } = getYearRange(year);
  const [incomeEntries, expenseEntries] = await Promise.all([
    prisma.incomeEntry.findMany({
      where: {
        householdId,
        competenceDate: {
          gte: start,
          lt: end,
        },
      },
      select: { competenceDate: true },
    }),
    prisma.expenseEntry.findMany({
      where: {
        householdId,
        competenceDate: {
          gte: start,
          lt: end,
        },
      },
      select: { competenceDate: true },
    }),
  ]);

  return new Set(
    [...incomeEntries, ...expenseEntries].map((entry) =>
      toDateOnly(entry.competenceDate).slice(0, 7),
    ),
  );
}

function inferAccountType(name: string) {
  const normalized = name.trim().toLowerCase();

  if (normalized.includes("cart")) {
    return "CREDIT_CARD" as const;
  }

  if (normalized.includes("digital")) {
    return "DIGITAL_WALLET" as const;
  }

  if (normalized.includes("poup")) {
    return "SAVINGS" as const;
  }

  return "CHECKING" as const;
}

function inferMemberType(name: string) {
  const normalized = name.trim().toLowerCase();
  return normalized === "casa" ? ("OTHER" as const) : ("ADULT" as const);
}

async function findOrCreateCategory(
  householdId: string,
  name: string,
  kind: "income" | "expense",
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const slug = slugify(normalizedName);
  const type = kind === "income" ? "INCOME" : "EXPENSE";

  const existing = await prisma.category.findFirst({
    where: {
      householdId,
      type,
      OR: [{ name: normalizedName }, { slug }],
    },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const created = await prisma.category.create({
    data: {
      householdId,
      name: normalizedName,
      slug: slug || `${type.toLowerCase()}-manual`,
      type,
    },
    select: { id: true },
  });

  return created.id;
}

async function findOrCreateAccount(householdId: string, name: string) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await prisma.financialAccount.findFirst({
    where: {
      householdId,
      name: normalizedName,
    },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const created = await prisma.financialAccount.create({
    data: {
      householdId,
      name: normalizedName,
      type: inferAccountType(normalizedName),
    },
    select: { id: true },
  });

  return created.id;
}

async function findOrCreateMember(
  householdId: string,
  userId: string,
  name: string,
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await prisma.householdMember.findFirst({
    where: {
      householdId,
      displayName: normalizedName,
    },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const created = await prisma.householdMember.create({
    data: {
      householdId,
      userId:
        normalizedName.toLowerCase() === "responsável" ? userId : undefined,
      displayName: normalizedName,
      type: inferMemberType(normalizedName),
      relationshipLabel:
        normalizedName.toLowerCase() === "responsável"
          ? "Responsável"
          : undefined,
    },
    select: { id: true },
  });

  return created.id;
}

async function persistFinanceEntry(
  householdId: string,
  userId: string,
  input: CreateFinanceEntryInput,
) {
  const [categoryId, accountId, memberId] = await Promise.all([
    findOrCreateCategory(householdId, input.category, input.kind),
    findOrCreateAccount(householdId, input.account),
    findOrCreateMember(householdId, userId, input.member),
  ]);

  if (input.kind === "income") {
    await prisma.incomeEntry.create({
      data: {
        householdId,
        categoryId,
        accountId,
        memberId,
        title: input.title.trim(),
        amount: input.amount,
        competenceDate: new Date(input.competenceDate),
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        status: mapStatusToDb(input.status ?? "pending"),
        receivedAt:
          input.status === "paid"
            ? new Date(input.paymentDate ?? new Date().toISOString())
            : null,
      },
    });
    return;
  }

  await prisma.expenseEntry.create({
    data: {
      householdId,
      categoryId,
      accountId,
      memberId,
      title: input.title.trim(),
      amount: input.amount,
      competenceDate: new Date(input.competenceDate),
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      status: mapStatusToDb(input.status ?? "pending"),
      paidAt:
        input.status === "paid"
          ? new Date(input.paymentDate ?? new Date().toISOString())
          : null,
      isFixed: input.isFixed ?? input.account === "Planejamento essencial",
    },
  });
}

function mapSyncRowsToEntries(input: SyncFinanceMonthInput, monthKey: string) {
  return input.rows.map((row) => ({
    title: row.title.trim(),
    amount: row.amount,
    kind: row.section === "income" ? ("income" as const) : ("expense" as const),
    category: row.category.trim(),
    member: row.member.trim(),
    dueDate: getMonthDate(monthKey, getMonthDay(row.dueDate)),
    competenceDate: getMonthStart(monthKey),
    account: row.account.trim(),
    status: row.status,
    paymentDate: row.paymentDate,
    isFixed: row.section === "fixed",
  }));
}

function buildFinanceOverviewFromEntries(
  entries: FinanceEntry[],
): FinanceOverviewData {
  const currentMonthKey = getCurrentMonthKey();
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
      label: formatMonthLabel(monthKey),
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

  const monthlyFlow = Array.from(monthlyMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);

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
    monthlyFlow,
  };
}

async function getDatabaseFinanceOverview(householdId: string) {
  const [incomeEntries, expenseEntries] = await Promise.all([
    prisma.incomeEntry.findMany({
      where: { householdId },
      include: {
        category: { select: { name: true } },
        account: { select: { name: true } },
        member: { select: { displayName: true } },
      },
      orderBy: [{ competenceDate: "desc" }, { createdAt: "desc" }],
    }),
    prisma.expenseEntry.findMany({
      where: { householdId },
      include: {
        category: { select: { name: true } },
        account: { select: { name: true } },
        member: { select: { displayName: true } },
      },
      orderBy: [{ competenceDate: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const entries: FinanceEntry[] = [
    ...incomeEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      amount: Number(entry.amount),
      kind: "income" as const,
      category: entry.category?.name ?? "Receita",
      member: entry.member?.displayName ?? "Responsável",
      dueDate: toDateOnly(entry.dueDate ?? entry.competenceDate),
      competenceDate: toDateOnly(entry.competenceDate),
      paymentDate: entry.receivedAt?.toISOString(),
      status: mapEntryStatus(entry.status),
      account: entry.account?.name ?? "Conta principal",
    })),
    ...expenseEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      amount: Number(entry.amount),
      kind: "expense" as const,
      category: entry.category?.name ?? "Despesa",
      member: entry.member?.displayName ?? "Casa",
      dueDate: toDateOnly(entry.dueDate ?? entry.competenceDate),
      competenceDate: toDateOnly(entry.competenceDate),
      paymentDate: entry.paidAt?.toISOString(),
      status: mapEntryStatus(entry.status),
      account: entry.account?.name ?? "Conta principal",
      isFixed: entry.isFixed,
    })),
  ];

  return buildFinanceOverviewFromEntries(entries);
}

async function findEntryKind(householdId: string, id: string) {
  const [incomeEntry, expenseEntry] = await Promise.all([
    prisma.incomeEntry.findFirst({
      where: { householdId, id },
      select: { id: true },
    }),
    prisma.expenseEntry.findFirst({
      where: { householdId, id },
      select: { id: true },
    }),
  ]);

  if (incomeEntry) {
    return "income" as const;
  }

  if (expenseEntry) {
    return "expense" as const;
  }

  return null;
}

export async function getFinanceOverview() {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return getWorkspaceSnapshot(session).finance;
  }

  return getDatabaseFinanceOverview(workspace.household.id);
}

export async function createFinanceEntry(input: CreateFinanceEntryInput) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return addFinanceEntry(session, input).finance;
  }

  await persistFinanceEntry(workspace.household.id, workspace.user.id, input);
  return getDatabaseFinanceOverview(workspace.household.id);
}

export async function createFinanceEntries(inputs: CreateFinanceEntryInput[]) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    for (const input of inputs) {
      addFinanceEntry(session, input);
    }

    return getWorkspaceSnapshot(session).finance;
  }

  for (const input of inputs) {
    await persistFinanceEntry(workspace.household.id, workspace.user.id, input);
  }

  return getDatabaseFinanceOverview(workspace.household.id);
}

export async function syncFinanceMonthPlan(input: SyncFinanceMonthInput) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return replaceFinanceMonthEntries(session, input).finance;
  }

  const householdId = workspace.household.id;
  const userId = workspace.user.id;
  const [yearValue] = input.monthKey.split("-");
  const year = Number(yearValue);
  const filledMonthKeys = await getFilledMonthKeysInYear(householdId, year);
  const shouldCopyToEmptyMonths =
    filledMonthKeys.size === 0 ||
    (filledMonthKeys.size === 1 && filledMonthKeys.has(input.monthKey));
  const targetMonthKeys = shouldCopyToEmptyMonths
    ? getYearMonthKeys(year).filter(
        (monthKey) =>
          monthKey === input.monthKey || !filledMonthKeys.has(monthKey),
      )
    : [input.monthKey];

  for (const monthKey of targetMonthKeys) {
    const monthEntries = mapSyncRowsToEntries(input, monthKey);
    const { start, end } = getMonthRange(monthKey);

    await prisma.incomeEntry.deleteMany({
      where: {
        householdId,
        competenceDate: {
          gte: start,
          lt: end,
        },
      },
    });
    await prisma.expenseEntry.deleteMany({
      where: {
        householdId,
        competenceDate: {
          gte: start,
          lt: end,
        },
      },
    });

    for (const entry of monthEntries) {
      await persistFinanceEntry(householdId, userId, entry);
    }
  }

  return getDatabaseFinanceOverview(householdId);
}

export async function updateEntryStatus(input: {
  id: string;
  status: FinancialStatus;
}) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return updateFinanceEntryStatus(session, input).finance;
  }

  const entryKind = await findEntryKind(workspace.household.id, input.id);

  if (entryKind === "income") {
    await prisma.incomeEntry.update({
      where: { id: input.id },
      data: {
        status: mapStatusToDb(input.status),
        receivedAt: input.status === "paid" ? new Date() : null,
      },
    });
  }

  if (entryKind === "expense") {
    await prisma.expenseEntry.update({
      where: { id: input.id },
      data: {
        status: mapStatusToDb(input.status),
        paidAt: input.status === "paid" ? new Date() : null,
      },
    });
  }

  return getDatabaseFinanceOverview(workspace.household.id);
}

export async function deleteEntry(id: string) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return removeFinanceEntry(session, id).finance;
  }

  const entryKind = await findEntryKind(workspace.household.id, id);

  if (entryKind === "income") {
    await prisma.incomeEntry.delete({ where: { id } });
  }

  if (entryKind === "expense") {
    await prisma.expenseEntry.delete({ where: { id } });
  }

  return getDatabaseFinanceOverview(workspace.household.id);
}

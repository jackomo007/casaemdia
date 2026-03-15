import "server-only";

import { prisma } from "@/lib/db/prisma";
import { getMonthKeyFromDateValue } from "@/lib/utils/date";
import {
  addShoppingList,
  addShoppingListItem,
  getWorkspaceSnapshot,
  updateShoppingItemStatus,
} from "@/server/repositories/demo-store";
import { getCurrentWorkspace } from "@/server/services/current-workspace-service";
import type {
  CreateShoppingListInput,
  CreateShoppingListItemInput,
  ShoppingListKind,
  ShoppingListSummary,
  UpdateShoppingListItemStatusInput,
} from "@/types";

const SHOPPING_META_PREFIX = "[shopping-meta]";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function getReferenceMonthDate(monthKey: string) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);

  return new Date(Date.UTC(year, month - 1, 1));
}

function mapShoppingKind(kind: "GROCERY" | "PLANNED"): ShoppingListKind {
  return kind === "PLANNED" ? "planned" : "grocery";
}

function mapShoppingKindToDb(kind: ShoppingListKind) {
  return kind === "planned" ? ("PLANNED" as const) : ("GROCERY" as const);
}

function hasExtendedShoppingSchema() {
  const fields =
    (
      prisma as typeof prisma & {
        _runtimeDataModel?: {
          models?: {
            ShoppingList?: {
              fields?: Array<{ name: string }>;
            };
          };
        };
      }
    )._runtimeDataModel?.models?.ShoppingList?.fields ?? [];
  const names = new Set(fields.map((field) => field.name));

  return names.has("kind") && names.has("referenceMonth");
}

function encodeLegacyDescription(input: CreateShoppingListInput) {
  const payload = JSON.stringify({
    kind: input.kind,
    monthKey: input.monthKey,
  });
  const description = input.description?.trim();

  return description
    ? `${SHOPPING_META_PREFIX}${payload}\n${description}`
    : `${SHOPPING_META_PREFIX}${payload}`;
}

function extractLegacyMetadata(description?: string | null) {
  if (!description?.startsWith(SHOPPING_META_PREFIX)) {
    return {
      description: description ?? undefined,
      kind: null,
      monthKey: null,
    };
  }

  const [header, ...rest] = description.split("\n");
  const rawPayload = header.slice(SHOPPING_META_PREFIX.length);

  try {
    const parsed = JSON.parse(rawPayload) as {
      kind?: ShoppingListKind;
      monthKey?: string;
    };

    return {
      description: rest.join("\n").trim() || undefined,
      kind:
        parsed.kind === "planned" || parsed.kind === "grocery"
          ? parsed.kind
          : null,
      monthKey:
        typeof parsed.monthKey === "string" &&
        /^\d{4}-\d{2}$/.test(parsed.monthKey)
          ? parsed.monthKey
          : null,
    };
  } catch {
    return {
      description,
      kind: null,
      monthKey: null,
    };
  }
}

async function findOrCreateShoppingCategory(householdId: string, name: string) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const slug = slugify(normalizedName);
  const existing = await prisma.category.findFirst({
    where: {
      householdId,
      type: "SHOPPING",
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
      slug: slug || "shopping-manual",
      type: "SHOPPING",
    },
    select: { id: true },
  });

  return created.id;
}

async function getDatabaseShoppingLists(householdId: string) {
  if (!hasExtendedShoppingSchema()) {
    return getLegacyDatabaseShoppingLists(householdId);
  }

  try {
    const lists = await prisma.shoppingList.findMany({
      where: { householdId },
      include: {
        category: {
          select: { name: true },
        },
        items: {
          select: {
            id: true,
            name: true,
            quantityLabel: true,
            estimatedCost: true,
            isPurchased: true,
            createdAt: true,
          },
          orderBy: [{ isPurchased: "asc" }, { createdAt: "asc" }],
        },
      },
      orderBy: [{ referenceMonth: "desc" }, { updatedAt: "desc" }],
    });

    return lists.map<ShoppingListSummary>((list) => {
      const legacyMetadata = extractLegacyMetadata(list.description);
      const items = list.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantityLabel ?? "1 item",
        estimatedCost: Number(item.estimatedCost ?? 0),
        checked: item.isPurchased,
      }));
      const itemCount = items.length;
      const completedItems = items.filter((item) => item.checked).length;
      const estimatedFromItems = items.reduce(
        (total, item) => total + item.estimatedCost,
        0,
      );

      return {
        id: list.id,
        title: list.title,
        category: list.category?.name ?? "Geral",
        description: legacyMetadata.description,
        kind: mapShoppingKind(list.kind),
        monthKey: getMonthKeyFromDateValue(list.referenceMonth.toISOString()),
        estimatedTotal:
          Number(list.estimatedTotal ?? 0) > 0
            ? Number(list.estimatedTotal ?? 0)
            : estimatedFromItems,
        progress:
          itemCount > 0 ? Math.round((completedItems / itemCount) * 100) : 0,
        itemCount,
        completedItems,
        items,
      };
    });
  } catch {
    return getLegacyDatabaseShoppingLists(householdId);
  }
}

async function getLegacyDatabaseShoppingLists(householdId: string) {
  const lists = await prisma.shoppingList.findMany({
    where: { householdId },
    include: {
      category: {
        select: { name: true },
      },
      items: {
        select: {
          id: true,
          name: true,
          quantityLabel: true,
          estimatedCost: true,
          isPurchased: true,
          createdAt: true,
        },
        orderBy: [{ isPurchased: "asc" }, { createdAt: "asc" }],
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return lists.map<ShoppingListSummary>((list) => {
    const legacyMetadata = extractLegacyMetadata(list.description);
    const items = list.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantityLabel ?? "1 item",
      estimatedCost: Number(item.estimatedCost ?? 0),
      checked: item.isPurchased,
    }));
    const itemCount = items.length;
    const completedItems = items.filter((item) => item.checked).length;
    const estimatedFromItems = items.reduce(
      (total, item) => total + item.estimatedCost,
      0,
    );

    return {
      id: list.id,
      title: list.title,
      category: list.category?.name ?? "Geral",
      description: legacyMetadata.description,
      kind: legacyMetadata.kind ?? "grocery",
      monthKey:
        legacyMetadata.monthKey ??
        getMonthKeyFromDateValue(list.createdAt.toISOString()),
      estimatedTotal:
        Number(list.estimatedTotal ?? 0) > 0
          ? Number(list.estimatedTotal ?? 0)
          : estimatedFromItems,
      progress:
        itemCount > 0 ? Math.round((completedItems / itemCount) * 100) : 0,
      itemCount,
      completedItems,
      items,
    };
  });
}

async function createLegacyShoppingList(
  householdId: string,
  categoryId: string | null,
  input: CreateShoppingListInput,
) {
  await prisma.shoppingList.create({
    data: {
      householdId,
      categoryId,
      title: input.title,
      description: encodeLegacyDescription(input),
      estimatedTotal: input.estimatedTotal ?? null,
    },
  });

  return getLegacyDatabaseShoppingLists(householdId);
}

export async function getShoppingLists() {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return getWorkspaceSnapshot(session).shoppingLists;
  }

  return getDatabaseShoppingLists(workspace.household.id);
}

export async function createShoppingList(input: CreateShoppingListInput) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return addShoppingList(session, input).shoppingLists;
  }

  const categoryId = await findOrCreateShoppingCategory(
    workspace.household.id,
    input.category,
  );

  if (!hasExtendedShoppingSchema()) {
    return createLegacyShoppingList(workspace.household.id, categoryId, input);
  }

  try {
    await prisma.shoppingList.create({
      data: {
        householdId: workspace.household.id,
        categoryId,
        title: input.title,
        description: input.description?.trim() || null,
        estimatedTotal: input.estimatedTotal ?? null,
        kind: mapShoppingKindToDb(input.kind),
        referenceMonth: getReferenceMonthDate(input.monthKey),
      },
    });
  } catch {
    return createLegacyShoppingList(workspace.household.id, categoryId, input);
  }

  return getDatabaseShoppingLists(workspace.household.id);
}

export async function createShoppingListItem(
  input: CreateShoppingListItemInput,
) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return addShoppingListItem(session, input).shoppingLists;
  }

  const shoppingList = await prisma.shoppingList.findFirst({
    where: {
      id: input.shoppingListId,
      householdId: workspace.household.id,
    },
    select: { id: true, householdId: true },
  });

  if (!shoppingList) {
    throw new Error("Lista de compras não encontrada.");
  }

  await prisma.shoppingListItem.create({
    data: {
      shoppingListId: shoppingList.id,
      householdId: shoppingList.householdId,
      name: input.name,
      quantityLabel: input.quantity?.trim() || null,
      estimatedCost: input.estimatedCost ?? null,
    },
  });

  return getDatabaseShoppingLists(workspace.household.id);
}

export async function updateShoppingListItemStatus(
  input: UpdateShoppingListItemStatusInput,
) {
  const { session, workspace } = await getCurrentWorkspace();

  if (!workspace) {
    return updateShoppingItemStatus(session, input).shoppingLists;
  }

  const shoppingItem = await prisma.shoppingListItem.findFirst({
    where: {
      id: input.id,
      householdId: workspace.household.id,
    },
    select: { id: true },
  });

  if (!shoppingItem) {
    throw new Error("Item de compra não encontrado.");
  }

  await prisma.shoppingListItem.update({
    where: { id: shoppingItem.id },
    data: { isPurchased: input.checked },
  });

  return getDatabaseShoppingLists(workspace.household.id);
}

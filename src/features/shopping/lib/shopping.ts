import { getCurrentMonthKey } from "@/lib/utils/date";
import type { ShoppingListKind, ShoppingListSummary } from "@/types";

export function formatShoppingMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getShoppingMonthOptions(
  lists: ShoppingListSummary[],
  currentMonth = getCurrentMonthKey(),
) {
  return Array.from(
    new Set([currentMonth, ...lists.map((list) => list.monthKey)]),
  ).sort((left, right) => right.localeCompare(left));
}

export function getShoppingKindMeta(kind: ShoppingListKind) {
  if (kind === "grocery") {
    return {
      label: "Mercado e rotina",
      description:
        "Compras de supermercado, atacadão, limpeza, farmácia e reposições da casa.",
    };
  }

  return {
    label: "Compras pontuais",
    description:
      "Itens maiores ou planejados do mês, como escola, notebook, quarto de visitas e afins.",
  };
}

export function buildShoppingMonthSummary(lists: ShoppingListSummary[]) {
  const totalEstimated = lists.reduce(
    (total, list) => total + list.estimatedTotal,
    0,
  );
  const totalItems = lists.reduce((total, list) => total + list.itemCount, 0);
  const completedItems = lists.reduce(
    (total, list) => total + list.completedItems,
    0,
  );
  const openLists = lists.filter((list) => list.progress < 100).length;
  const progress =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    totalEstimated,
    totalItems,
    completedItems,
    openLists,
    progress,
  };
}

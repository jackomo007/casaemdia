import {
  buildShoppingMonthSummary,
  getShoppingKindMeta,
  getShoppingMonthOptions,
} from "@/features/shopping/lib/shopping";
import type { ShoppingListSummary } from "@/types";

const lists: ShoppingListSummary[] = [
  {
    id: "shopping-1",
    title: "Mercado do mês",
    category: "Casa",
    kind: "grocery",
    monthKey: "2026-03",
    estimatedTotal: 420,
    progress: 50,
    itemCount: 4,
    completedItems: 2,
    items: [],
  },
  {
    id: "shopping-2",
    title: "Volta às aulas",
    category: "Escola",
    kind: "planned",
    monthKey: "2026-02",
    estimatedTotal: 680,
    progress: 0,
    itemCount: 3,
    completedItems: 0,
    items: [],
  },
];

describe("shopping helpers", () => {
  it("ordena os meses do mais recente para o mais antigo e inclui o mês atual", () => {
    expect(getShoppingMonthOptions(lists, "2026-04")).toEqual([
      "2026-04",
      "2026-03",
      "2026-02",
    ]);
  });

  it("resume os totais do mês selecionado", () => {
    expect(buildShoppingMonthSummary([lists[0]])).toEqual({
      totalEstimated: 420,
      totalItems: 4,
      completedItems: 2,
      openLists: 1,
      progress: 50,
    });
  });

  it("retorna a legenda correta para cada tipo de compra", () => {
    expect(getShoppingKindMeta("grocery").label).toBe("Mercado e rotina");
    expect(getShoppingKindMeta("planned").label).toBe("Compras pontuais");
  });
});

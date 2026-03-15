vi.mock("server-only", () => ({}));

import {
  addShoppingList,
  addShoppingListItem,
  removeShoppingList,
  removeShoppingListItem,
} from "@/server/repositories/demo-store";

describe("shopping demo store", () => {
  it("permite apagar uma lista inteira e recalcula o snapshot", () => {
    const context = {
      scenario: "trialing" as const,
      workspaceKey: `shopping-remove-${Date.now()}`,
      workspacePreset: "blank" as const,
      user: {
        email: "shopping-remove@example.com",
        fullName: "Teste Compras",
      },
    };

    const created = addShoppingList(context, {
      title: "Mercado do mês",
      category: "Casa",
      kind: "grocery",
      monthKey: "2026-03",
      estimatedTotal: 250,
    });

    expect(created.shoppingLists).toHaveLength(1);

    const removed = removeShoppingList(context, created.shoppingLists[0]!.id);

    expect(removed.shoppingLists).toHaveLength(0);
    expect(removed.dashboard.shoppingLists).toHaveLength(0);
  });

  it("permite apagar um item individual da lista", () => {
    const context = {
      scenario: "trialing" as const,
      workspaceKey: `shopping-remove-item-${Date.now()}`,
      workspacePreset: "blank" as const,
      user: {
        email: "shopping-remove-item@example.com",
        fullName: "Teste Compras",
      },
    };

    const created = addShoppingList(context, {
      title: "Mercado do mês",
      category: "Casa",
      kind: "grocery",
      monthKey: "2026-03",
      estimatedTotal: 250,
    });

    const withItem = addShoppingListItem(context, {
      shoppingListId: created.shoppingLists[0]!.id,
      name: "Arroz",
      quantity: "2 pacotes",
      estimatedCost: 30,
    });

    const itemId = withItem.shoppingLists[0]!.items[0]!.id;
    const removed = removeShoppingListItem(context, itemId);

    expect(removed.shoppingLists[0]!.items).toHaveLength(0);
    expect(removed.shoppingLists[0]!.itemCount).toBe(0);
  });
});

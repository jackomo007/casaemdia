vi.mock("server-only", () => ({}));

import {
  addShoppingList,
  removeShoppingList,
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
});

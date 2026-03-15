import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShoppingOverview } from "@/features/shopping/components/shopping-overview";
import type { ShoppingListSummary } from "@/types";

vi.mock("@/features/shopping/components/shopping-list-form", () => ({
  ShoppingListForm: ({ selectedMonth }: { selectedMonth: string }) => (
    <div>form-{selectedMonth}</div>
  ),
}));

vi.mock("@/features/shopping/components/shopping-list-panel", () => ({
  ShoppingListPanel: ({
    list,
    onDeleteList,
  }: {
    list: ShoppingListSummary;
    onDeleteList?: (listId: string) => void;
  }) => (
    <button type="button" onClick={() => onDeleteList?.(list.id)}>
      apagar-{list.title}
    </button>
  ),
}));

function buildList(): ShoppingListSummary {
  return {
    id: "shopping-list-1",
    title: "Mercado do mes",
    category: "Casa",
    description: "Reposicao da semana",
    kind: "grocery",
    monthKey: "2026-03",
    estimatedTotal: 250,
    progress: 0,
    itemCount: 1,
    completedItems: 0,
    items: [
      {
        id: "shopping-item-1",
        name: "Arroz",
        quantity: "2 pacotes",
        estimatedCost: 30,
        checked: false,
      },
    ],
  };
}

describe("ShoppingOverview", () => {
  it("volta para o estado vazio quando a ultima lista e apagada", async () => {
    const user = userEvent.setup();

    render(<ShoppingOverview lists={[buildList()]} />);

    expect(
      screen.getByRole("button", { name: "apagar-Mercado do mes" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "apagar-Mercado do mes" }),
    );

    expect(
      screen.getByText("Sem listas em mercado e rotina"),
    ).toBeInTheDocument();
  });
});

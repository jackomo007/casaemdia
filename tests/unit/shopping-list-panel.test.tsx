import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShoppingListPanel } from "@/features/shopping/components/shopping-list-panel";
import type { ShoppingListSummary } from "@/types";

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  createShoppingListItemAction: vi.fn(),
  deleteShoppingListAction: vi.fn(),
  deleteShoppingListItemAction: vi.fn(),
  updateShoppingListItemStatusAction: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mocks.refresh,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock("@/server/actions/shopping-actions", () => ({
  createShoppingListItemAction: mocks.createShoppingListItemAction,
  deleteShoppingListAction: mocks.deleteShoppingListAction,
  deleteShoppingListItemAction: mocks.deleteShoppingListItemAction,
  updateShoppingListItemStatusAction: mocks.updateShoppingListItemStatusAction,
}));

function buildList(
  overrides?: Partial<ShoppingListSummary>,
): ShoppingListSummary {
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
    ...overrides,
  };
}

describe("ShoppingListPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deleteShoppingListAction.mockResolvedValue({ success: true });
  });

  it("remove a lista localmente depois de apagar", async () => {
    const user = userEvent.setup();
    const onDeleteList = vi.fn();

    render(
      <ShoppingListPanel list={buildList()} onDeleteList={onDeleteList} />,
    );

    await user.click(screen.getByLabelText("Apagar lista Mercado do mes"));
    await user.click(screen.getByRole("button", { name: "Apagar lista" }));

    expect(mocks.deleteShoppingListAction).toHaveBeenCalledWith({
      id: "shopping-list-1",
    });
    expect(onDeleteList).toHaveBeenCalledWith("shopping-list-1");
    expect(mocks.refresh).toHaveBeenCalled();
  });
});

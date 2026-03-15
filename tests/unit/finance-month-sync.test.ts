vi.mock("server-only", () => ({}));

import { replaceFinanceMonthEntries } from "@/server/repositories/demo-store";

function createRow(amount: number) {
  return {
    title: "Aluguel",
    amount,
    dueDate: "2026-03-10",
    account: "Planejamento essencial",
    status: "pending" as const,
    section: "fixed" as const,
    category: "Essencial",
    member: "Casa",
  };
}

describe("replaceFinanceMonthEntries", () => {
  it("copia para os meses vazios apenas no primeiro salvamento", () => {
    const context = {
      scenario: "trialing" as const,
      workspaceKey: `finance-sync-${Date.now()}`,
      workspacePreset: "blank" as const,
      user: {
        email: "teste@example.com",
        fullName: "Teste Financeiro",
      },
    };

    const firstSave = replaceFinanceMonthEntries(context, {
      monthKey: "2026-03",
      copyToEmptyMonths: true,
      rows: [createRow(2400)],
    });

    expect(firstSave.finance.entries).toHaveLength(12);
    expect(
      new Set(
        firstSave.finance.entries.map((entry) =>
          entry.competenceDate.slice(0, 7),
        ),
      ).size,
    ).toBe(12);

    const secondSave = replaceFinanceMonthEntries(context, {
      monthKey: "2026-03",
      copyToEmptyMonths: false,
      rows: [createRow(2600)],
    });

    const marchEntries = secondSave.finance.entries.filter((entry) =>
      entry.competenceDate.startsWith("2026-03"),
    );
    const aprilEntries = secondSave.finance.entries.filter((entry) =>
      entry.competenceDate.startsWith("2026-04"),
    );

    expect(marchEntries).toHaveLength(1);
    expect(aprilEntries).toHaveLength(1);
    expect(marchEntries[0]?.amount).toBe(2600);
    expect(aprilEntries[0]?.amount).toBe(2400);
  });

  it("inicia os meses copiados como pendentes", () => {
    const context = {
      scenario: "trialing" as const,
      workspaceKey: `finance-sync-pending-${Date.now()}`,
      workspacePreset: "blank" as const,
      user: {
        email: "teste-pending@example.com",
        fullName: "Teste Pending",
      },
    };

    const firstSave = replaceFinanceMonthEntries(context, {
      monthKey: "2026-03",
      copyToEmptyMonths: true,
      rows: [
        {
          ...createRow(2400),
          status: "paid" as const,
          paymentDate: "2026-03-10T12:00:00.000Z",
        },
      ],
    });

    const marchEntry = firstSave.finance.entries.find((entry) =>
      entry.competenceDate.startsWith("2026-03"),
    );
    const aprilEntry = firstSave.finance.entries.find((entry) =>
      entry.competenceDate.startsWith("2026-04"),
    );

    expect(marchEntry?.status).toBe("paid");
    expect(marchEntry?.paymentDate).toBe("2026-03-10T12:00:00.000Z");
    expect(aprilEntry?.status).toBe("pending");
    expect(aprilEntry?.paymentDate).toBeUndefined();
  });
});

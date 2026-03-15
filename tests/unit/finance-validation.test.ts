import {
  financeEntrySchema,
  financeMonthSyncSchema,
  financeSheetSchema,
} from "@/lib/validations/finance";

describe("financeEntrySchema", () => {
  it("aceita um lancamento valido", () => {
    const result = financeEntrySchema.safeParse({
      title: "Supermercado",
      amount: 199.9,
      kind: "expense",
      category: "Alimentacao",
      member: "Responsavel",
      dueDate: "2026-03-20",
      competenceDate: "2026-03-01",
      account: "Conta principal",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita valor zerado", () => {
    const result = financeEntrySchema.safeParse({
      title: "Conta invalida",
      amount: 0,
      kind: "expense",
      category: "Casa",
      member: "Rafael",
      dueDate: "2026-03-20",
      competenceDate: "2026-03-01",
      account: "Conta principal",
    });

    expect(result.success).toBe(false);
  });

  it("aceita varias linhas preenchidas na planilha rapida", () => {
    const result = financeSheetSchema.safeParse([
      {
        title: "Aluguel",
        amount: 2400,
        kind: "expense",
        category: "Essencial",
        member: "Casa",
        dueDate: "2026-03-10",
        competenceDate: "2026-03-01",
        account: "Planejamento essencial",
      },
      {
        title: "CLT principal",
        amount: 7100,
        kind: "income",
        category: "CLT",
        member: "Responsavel",
        dueDate: "2026-03-05",
        competenceDate: "2026-03-01",
        account: "Conta principal",
      },
    ]);

    expect(result.success).toBe(true);
  });

  it("aceita a flag de copia apenas no primeiro salvamento mensal", () => {
    const result = financeMonthSyncSchema.safeParse({
      monthKey: "2026-03",
      copyToEmptyMonths: true,
      rows: [
        {
          title: "Aluguel",
          amount: 2400,
          dueDate: "2026-03-10",
          account: "Planejamento essencial",
          status: "pending",
          section: "fixed",
          category: "Essencial",
          member: "Casa",
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});

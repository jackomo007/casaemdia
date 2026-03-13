import { financeEntrySchema } from "@/lib/validations/finance";

describe("financeEntrySchema", () => {
  it("aceita um lancamento valido", () => {
    const result = financeEntrySchema.safeParse({
      title: "Supermercado",
      amount: 199.9,
      kind: "expense",
      category: "Alimentacao",
      member: "Marina",
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
});

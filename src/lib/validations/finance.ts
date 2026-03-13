import { z } from "zod";

export const financeEntrySchema = z.object({
  title: z.string().min(2, "Informe um titulo."),
  amount: z.coerce.number().positive("Informe um valor maior que zero."),
  kind: z.enum(["income", "expense"]),
  category: z.string().min(2, "Selecione uma categoria."),
  member: z.string().min(2, "Selecione o responsavel."),
  dueDate: z.string().min(1, "Selecione a data de vencimento."),
  competenceDate: z.string().min(1, "Selecione a competencia."),
  account: z.string().min(2, "Selecione a conta."),
});

export type FinanceEntrySchema = z.infer<typeof financeEntrySchema>;

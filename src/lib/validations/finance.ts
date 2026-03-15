import { z } from "zod";

export const financeEntrySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Informe um título.")
    .max(100, "Use no máximo 100 caracteres."),
  amount: z.coerce.number().positive("Informe um valor maior que zero."),
  kind: z.enum(["income", "expense"]),
  category: z
    .string()
    .trim()
    .min(2, "Selecione uma categoria.")
    .max(60, "Use no máximo 60 caracteres."),
  member: z
    .string()
    .trim()
    .min(2, "Selecione o responsável.")
    .max(60, "Use no máximo 60 caracteres."),
  dueDate: z.string().min(1, "Selecione a data de vencimento."),
  competenceDate: z.string().min(1, "Selecione a competência."),
  account: z
    .string()
    .trim()
    .min(2, "Selecione a conta.")
    .max(80, "Use no máximo 80 caracteres."),
});

export const financeSheetSchema = z
  .array(financeEntrySchema)
  .min(1, "Preencha ao menos uma linha.");

export const financeMonthRowSchema = z.object({
  id: z.string().trim().min(1).optional(),
  title: z
    .string()
    .trim()
    .min(2, "Informe um título.")
    .max(100, "Use no máximo 100 caracteres."),
  amount: z.coerce.number().positive("Informe um valor maior que zero."),
  dueDate: z.string().min(1, "Selecione a data de vencimento."),
  account: z
    .string()
    .trim()
    .min(2, "Selecione a conta.")
    .max(80, "Use no máximo 80 caracteres."),
  status: z.enum(["paid", "pending", "overdue"]),
  section: z.enum(["income", "fixed", "negotiable"]),
  category: z
    .string()
    .trim()
    .min(2, "Selecione uma categoria.")
    .max(60, "Use no máximo 60 caracteres."),
  member: z
    .string()
    .trim()
    .min(2, "Selecione o responsável.")
    .max(60, "Use no máximo 60 caracteres."),
  paymentDate: z.string().min(1).optional(),
});

export const financeMonthSyncSchema = z.object({
  monthKey: z.string().regex(/^\d{4}-\d{2}$/, "Selecione um mês válido."),
  rows: z.array(financeMonthRowSchema),
  copyToEmptyMonths: z.boolean().optional(),
});

export const financeEntryStatusSchema = z.object({
  id: z.string().trim().min(1, "Informe o lançamento."),
  status: z.enum(["paid", "pending", "overdue"]),
});

export type FinanceEntrySchema = z.infer<typeof financeEntrySchema>;
export type FinanceSheetSchema = z.infer<typeof financeSheetSchema>;
export type FinanceMonthRowSchema = z.infer<typeof financeMonthRowSchema>;
export type FinanceMonthSyncSchema = z.infer<typeof financeMonthSyncSchema>;
export type FinanceEntryStatusSchema = z.infer<typeof financeEntryStatusSchema>;

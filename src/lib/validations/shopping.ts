import { z } from "zod";

const optionalAmount = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce
    .number()
    .min(0, "Informe um valor maior ou igual a zero.")
    .optional(),
);

export const shoppingListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe um título.")
    .max(100, "Use no máximo 100 caracteres."),
  category: z
    .string()
    .trim()
    .min(2, "Informe a categoria.")
    .max(60, "Use no máximo 60 caracteres."),
  description: z
    .string()
    .trim()
    .max(240, "Use no máximo 240 caracteres.")
    .optional()
    .or(z.literal("")),
  kind: z.enum(["grocery", "planned"]),
  monthKey: z.string().regex(/^\d{4}-\d{2}$/, "Selecione um mês válido."),
  estimatedTotal: optionalAmount,
});

export const shoppingListItemSchema = z.object({
  shoppingListId: z.string().trim().min(1, "Selecione a lista."),
  name: z
    .string()
    .trim()
    .min(2, "Informe o item.")
    .max(100, "Use no máximo 100 caracteres."),
  quantity: z
    .string()
    .trim()
    .max(40, "Use no máximo 40 caracteres.")
    .optional()
    .or(z.literal("")),
  estimatedCost: optionalAmount,
});

export const shoppingItemStatusSchema = z.object({
  id: z.string().trim().min(1, "Selecione o item."),
  checked: z.boolean(),
});

export const shoppingListDeleteSchema = z.object({
  id: z.string().trim().min(1, "Selecione a lista."),
});

export const shoppingListItemDeleteSchema = z.object({
  id: z.string().trim().min(1, "Selecione o item."),
});

export type ShoppingListSchema = z.infer<typeof shoppingListSchema>;
export type ShoppingListItemSchema = z.infer<typeof shoppingListItemSchema>;
export type ShoppingItemStatusSchema = z.infer<typeof shoppingItemStatusSchema>;
export type ShoppingListDeleteSchema = z.infer<typeof shoppingListDeleteSchema>;
export type ShoppingListItemDeleteSchema = z.infer<
  typeof shoppingListItemDeleteSchema
>;

import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe um título.")
    .max(100, "Use no máximo 100 caracteres."),
  description: z
    .string()
    .trim()
    .min(6, "Adicione detalhes da tarefa.")
    .max(300, "Use no máximo 300 caracteres."),
  dueDate: z.string().min(1, "Selecione a data limite."),
  priority: z.enum(["low", "medium", "high"]),
  assignee: z
    .string()
    .trim()
    .min(2, "Selecione um responsável.")
    .max(60, "Use no máximo 60 caracteres."),
  points: z.coerce.number().min(0).optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;

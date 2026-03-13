import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Informe um titulo."),
  description: z.string().min(6, "Adicione detalhes da tarefa."),
  dueDate: z.string().min(1, "Selecione a data limite."),
  priority: z.enum(["low", "medium", "high"]),
  assignee: z.string().min(2, "Selecione um responsavel."),
  points: z.coerce.number().min(0).optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;

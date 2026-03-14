import { z } from "zod";

export const calendarEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe um título.")
    .max(100, "Use no máximo 100 caracteres."),
  description: z.string().trim().max(300, "Use no máximo 300 caracteres."),
  startsAt: z.string().min(1, "Selecione a data e hora."),
  kind: z.enum(["school", "medical", "billing", "family", "shopping", "task"]),
  priority: z.enum(["low", "medium", "high"]),
});

export type CalendarEventSchema = z.infer<typeof calendarEventSchema>;

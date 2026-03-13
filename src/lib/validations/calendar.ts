import { z } from "zod";

export const calendarEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe um título.")
    .max(100, "Use no máximo 100 caracteres."),
  description: z
    .string()
    .trim()
    .min(6, "Adicione um contexto curto.")
    .max(300, "Use no máximo 300 caracteres."),
  startsAt: z.string().min(1, "Selecione a data e hora."),
  kind: z.enum(["school", "medical", "billing", "family", "shopping", "task"]),
  badge: z
    .string()
    .trim()
    .min(2, "Informe um badge.")
    .max(30, "Use no máximo 30 caracteres."),
  childName: z
    .string()
    .trim()
    .max(60, "Use no máximo 60 caracteres.")
    .optional(),
});

export type CalendarEventSchema = z.infer<typeof calendarEventSchema>;

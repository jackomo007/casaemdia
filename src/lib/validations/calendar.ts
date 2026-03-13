import { z } from "zod";

export const calendarEventSchema = z.object({
  title: z.string().min(3, "Informe um titulo."),
  description: z.string().min(6, "Adicione um contexto curto."),
  startsAt: z.string().min(1, "Selecione a data e hora."),
  kind: z.enum(["school", "medical", "billing", "family", "shopping", "task"]),
  badge: z.string().min(2, "Informe um badge."),
  childName: z.string().optional(),
});

export type CalendarEventSchema = z.infer<typeof calendarEventSchema>;

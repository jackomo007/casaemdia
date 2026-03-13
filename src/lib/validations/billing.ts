import { z } from "zod";

export const selectPlanSchema = z.object({
  planCode: z.enum(["ESSENTIAL", "FAMILY", "FAMILY_AI"]),
});

export type SelectPlanSchema = z.infer<typeof selectPlanSchema>;

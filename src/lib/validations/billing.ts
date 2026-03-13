import { z } from "zod";

export const selectPlanSchema = z.object({
  planCode: z.enum(["TRIAL", "ESSENTIAL", "FAMILY", "FAMILY_AI"]),
});

export type SelectPlanSchema = z.infer<typeof selectPlanSchema>;

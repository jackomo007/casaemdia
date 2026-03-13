"use server";

import { revalidatePath } from "next/cache";

import { financeEntrySchema } from "@/lib/validations/finance";
import { createFinanceEntry } from "@/server/services/finance-service";

export async function createFinanceEntryAction(values: unknown) {
  const payload = financeEntrySchema.parse(values);
  await createFinanceEntry(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/financas");

  return { success: true };
}

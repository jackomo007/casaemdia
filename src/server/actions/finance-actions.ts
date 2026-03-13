"use server";

import { revalidatePath } from "next/cache";

import {
  financeEntrySchema,
  financeSheetSchema,
} from "@/lib/validations/finance";
import {
  createFinanceEntries,
  createFinanceEntry,
} from "@/server/services/finance-service";

export async function createFinanceEntryAction(values: unknown) {
  const payload = financeEntrySchema.parse(values);
  await createFinanceEntry(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/financas");

  return { success: true };
}

export async function createFinanceSheetEntriesAction(values: unknown) {
  const payload = financeSheetSchema.parse(values);
  await createFinanceEntries(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/financas");

  return { success: true };
}

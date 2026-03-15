"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  financeEntrySchema,
  financeEntryStatusSchema,
  financeMonthSyncSchema,
  financeSheetSchema,
} from "@/lib/validations/finance";
import {
  createFinanceEntries,
  createFinanceEntry,
  deleteEntry,
  syncFinanceMonthPlan,
  updateEntryStatus,
} from "@/server/services/finance-service";

const financeEntryDeleteSchema = z.object({
  id: z.string().trim().min(1, "Informe o lançamento."),
});

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

export async function syncFinanceMonthPlanAction(values: unknown) {
  try {
    const payload = financeMonthSyncSchema.parse(values);
    await syncFinanceMonthPlan(payload);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/financas");

    return { success: true };
  } catch (error) {
    console.error("Failed to sync finance month plan.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a planilha deste mês.",
    };
  }
}

export async function updateFinanceEntryStatusAction(values: unknown) {
  const payload = financeEntryStatusSchema.parse(values);
  await updateEntryStatus(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/financas");

  return { success: true };
}

export async function deleteFinanceEntryAction(values: unknown) {
  const payload = financeEntryDeleteSchema.parse(values);
  await deleteEntry(payload.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/financas");

  return { success: true };
}

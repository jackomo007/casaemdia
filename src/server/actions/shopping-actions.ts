"use server";

import { revalidatePath } from "next/cache";

import {
  shoppingItemStatusSchema,
  shoppingListItemSchema,
  shoppingListSchema,
} from "@/lib/validations/shopping";
import {
  createShoppingList,
  createShoppingListItem,
  updateShoppingListItemStatus,
} from "@/server/services/shopping-service";

export async function createShoppingListAction(values: unknown) {
  const payload = shoppingListSchema.parse(values);
  await createShoppingList(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/compras");

  return { success: true };
}

export async function createShoppingListItemAction(values: unknown) {
  const payload = shoppingListItemSchema.parse(values);
  await createShoppingListItem(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/compras");

  return { success: true };
}

export async function updateShoppingListItemStatusAction(values: unknown) {
  const payload = shoppingItemStatusSchema.parse(values);
  await updateShoppingListItemStatus(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/compras");

  return { success: true };
}

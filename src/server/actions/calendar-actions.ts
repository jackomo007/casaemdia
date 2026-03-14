"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { calendarEventSchema } from "@/lib/validations/calendar";
import {
  createCalendarEvent,
  deleteCalendarEvent,
} from "@/server/services/calendar-service";

const calendarEventDeleteSchema = z.object({
  id: z.string().trim().min(1, "Informe o evento."),
});

export async function createCalendarEventAction(values: unknown) {
  const payload = calendarEventSchema.parse(values);
  await createCalendarEvent(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");

  return { success: true };
}

export async function deleteCalendarEventAction(values: unknown) {
  const payload = calendarEventDeleteSchema.parse(values);
  await deleteCalendarEvent(payload.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");

  return { success: true };
}

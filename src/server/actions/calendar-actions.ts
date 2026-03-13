"use server";

import { revalidatePath } from "next/cache";

import { calendarEventSchema } from "@/lib/validations/calendar";
import { createCalendarEvent } from "@/server/services/calendar-service";

export async function createCalendarEventAction(values: unknown) {
  const payload = calendarEventSchema.parse(values);
  await createCalendarEvent(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");

  return { success: true };
}

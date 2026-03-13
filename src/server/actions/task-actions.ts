"use server";

import { revalidatePath } from "next/cache";

import { taskSchema } from "@/lib/validations/task";
import { createTask } from "@/server/services/task-service";

export async function createTaskAction(values: unknown) {
  const payload = taskSchema.parse(values);
  await createTask(payload);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tarefas");

  return { success: true };
}

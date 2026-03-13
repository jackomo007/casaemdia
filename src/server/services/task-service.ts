import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import {
  addTask,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { CreateTaskInput } from "@/types";

export async function getTaskList() {
  const session = await getWorkspaceSession();
  return getWorkspaceSnapshot(session).tasks;
}

export async function createTask(input: CreateTaskInput) {
  const session = await getWorkspaceSession();
  return addTask(session, input).tasks;
}

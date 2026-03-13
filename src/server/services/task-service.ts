import "server-only";

import { getSessionScenario } from "@/lib/auth/session";
import {
  addTask,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { CreateTaskInput } from "@/types";

export async function getTaskList() {
  const scenario = await getSessionScenario();
  return getWorkspaceSnapshot(scenario).tasks;
}

export async function createTask(input: CreateTaskInput) {
  const scenario = await getSessionScenario();
  return addTask(scenario, input).tasks;
}

import { TasksOverview } from "@/features/tasks/components/tasks-overview";
import { getTaskList } from "@/server/services/task-service";

export default async function TasksPage() {
  const tasks = await getTaskList();
  return <TasksOverview tasks={tasks} />;
}

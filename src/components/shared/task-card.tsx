import { CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/utils/formatters";
import { getPriorityLabel } from "@/lib/utils/labels";
import type { TaskItem } from "@/types";

const toneByPriority = {
  low: "neutral",
  medium: "warning",
  high: "danger",
} as const;

export function TaskCard({ task }: { task: TaskItem }) {
  const progress = Math.round((task.subtasksDone / task.subtasksTotal) * 100);

  return (
    <Card className="border-border/70 rounded-[24px] bg-white/90 shadow-[0_18px_46px_-36px_rgba(80,64,153,0.3)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <StatusBadge tone={toneByPriority[task.priority]}>
              {getPriorityLabel(task.priority)}
            </StatusBadge>
            <h3 className="text-base font-semibold text-slate-950">
              {task.title}
            </h3>
          </div>
          <CheckCircle2 className="h-5 w-5 text-slate-300" />
        </div>
        <p className="text-sm leading-6 text-slate-500">{task.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{task.assignee}</span>
            <span>{formatRelative(task.dueDate)}</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

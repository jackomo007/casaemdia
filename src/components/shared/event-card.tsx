import type { ReactNode } from "react";
import { CalendarClock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/formatters";
import { getPriorityLabel } from "@/lib/utils/labels";
import type { CalendarEventItem } from "@/types";

const priorityTone = {
  high: "danger",
  medium: "warning",
  low: "success",
} as const;

const kindLabel = {
  school: "Escola",
  medical: "Saude",
  billing: "Financeiro",
  family: "Familia",
  shopping: "Compras",
  task: "Agenda",
} as const;

export function EventCard({
  event,
  actions,
}: {
  event: CalendarEventItem;
  actions?: ReactNode;
}) {
  return (
    <Card className="border-border/70 rounded-[24px] bg-white/90 shadow-[0_20px_50px_-40px_rgba(80,64,153,0.34)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <StatusBadge tone={priorityTone[event.priority]}>
              {getPriorityLabel(event.priority)}
            </StatusBadge>
            <h3 className="text-base font-semibold text-slate-950">
              {event.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-2xl">
              <CalendarClock className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{formatDateTime(event.startsAt)}</span>
          <span>{kindLabel[event.kind]}</span>
        </div>
      </CardContent>
    </Card>
  );
}

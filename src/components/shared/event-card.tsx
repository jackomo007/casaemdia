import { CalendarClock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/formatters";
import type { CalendarEventItem } from "@/types";

export function EventCard({ event }: { event: CalendarEventItem }) {
  return (
    <Card className="border-border/70 rounded-[24px] bg-white/90 shadow-[0_20px_50px_-40px_rgba(80,64,153,0.34)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <StatusBadge tone="accent">{event.badge}</StatusBadge>
            <h3 className="text-base font-semibold text-slate-950">
              {event.title}
            </h3>
          </div>
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-2xl">
            <CalendarClock className="h-4 w-4" />
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-500">{event.description}</p>
        <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{formatDateTime(event.startsAt)}</span>
          {event.childName ? <span>{event.childName}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}

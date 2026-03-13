import { Lightbulb } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { InsightCardData } from "@/types";

export function InsightCard({ insight }: { insight: InsightCardData }) {
  return (
    <Card className="border-primary/10 rounded-[28px] bg-[linear-gradient(180deg,#fff,#f9f6ff)] shadow-[0_26px_80px_-60px_rgba(80,64,153,0.4)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
            <Lightbulb className="h-5 w-5" />
          </div>
          <StatusBadge tone="accent">{insight.tone}</StatusBadge>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-950">
            {insight.title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{insight.content}</p>
        </div>
        <p className="text-xs leading-5 text-slate-400">{insight.disclaimer}</p>
      </CardContent>
    </Card>
  );
}

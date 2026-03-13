import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { MetricCardData } from "@/types";

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight,
};

export function MetricCard({ metric }: { metric: MetricCardData }) {
  const Icon = trendIcon[metric.trend];

  return (
    <Card className="rounded-[28px] border-white/80 bg-white/90 shadow-[0_26px_80px_-52px_rgba(80,64,153,0.38)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-2xl">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">
            {metric.value}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {metric.helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

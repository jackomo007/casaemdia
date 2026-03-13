import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/formatters";
import type { PlanDefinition } from "@/types";

export function PlanCard({
  plan,
  action,
}: {
  plan: PlanDefinition;
  action?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-[32px] border-white/80 bg-white/95 shadow-[0_30px_80px_-60px_rgba(80,64,153,0.42)]",
        plan.recommended ? "ring-primary/20 ring-2" : "",
      )}
    >
      <CardContent className="flex h-full flex-col p-6">
        <div className="space-y-3">
          {plan.recommended ? (
            <span className="bg-primary text-primary-foreground inline-flex rounded-full px-3 py-1 text-xs font-semibold">
              Recomendado
            </span>
          ) : null}
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              {plan.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {plan.description}
            </p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(plan.priceMonthly)}
            </span>
            <span className="pb-1 text-sm text-slate-500">/mes</span>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            {plan.familySeats}
          </p>
          {plan.featureHighlights.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 text-sm text-slate-600"
            >
              <Check className="text-primary mt-0.5 h-4 w-4" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          {action ?? <Button className="w-full rounded-2xl">Escolher</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

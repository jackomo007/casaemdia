import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import type { FinancialSummary } from "@/types";

export function FinancialSummaryCard({
  summary,
}: {
  summary: FinancialSummary;
}) {
  return (
    <Card className="rounded-[28px] border-white/80 bg-[linear-gradient(180deg,#ffffff,#f7f5ff)] shadow-[0_26px_80px_-56px_rgba(80,64,153,0.44)]">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Situacao financeira
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(summary.balance)}
            </h3>
          </div>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
              Entradas
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {formatCurrency(summary.income)}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ArrowDownCircle className="h-4 w-4 text-rose-500" />
              Saidas
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {formatCurrency(summary.expense)}
            </p>
          </div>
        </div>
        <div className="border-primary/10 bg-primary/5 flex items-center justify-between rounded-3xl border px-4 py-3 text-sm">
          <span className="text-slate-600">Custo fixo sobre a renda</span>
          <span className="font-semibold text-slate-950">
            {formatPercent(summary.fixedCostRatio)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

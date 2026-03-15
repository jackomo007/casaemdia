"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildShoppingMonthSummary,
  formatShoppingMonthLabel,
  getShoppingKindMeta,
  getShoppingMonthOptions,
} from "@/features/shopping/lib/shopping";
import { ShoppingListForm } from "@/features/shopping/components/shopping-list-form";
import { ShoppingListPanel } from "@/features/shopping/components/shopping-list-panel";
import { formatCurrency } from "@/lib/utils/formatters";
import type { ShoppingListKind, ShoppingListSummary } from "@/types";

function ShoppingLane({
  kind,
  lists,
}: {
  kind: ShoppingListKind;
  lists: ShoppingListSummary[];
}) {
  const meta = getShoppingKindMeta(kind);

  return (
    <Card className="border-border/70 rounded-[32px] bg-white/85">
      <CardContent className="space-y-5 p-6">
        <SectionHeader title={meta.label} description={meta.description} />
        <div className="space-y-4">
          {lists.length ? (
            lists.map((list) => <ShoppingListPanel key={list.id} list={list} />)
          ) : (
            <EmptyState
              title={`Sem listas em ${meta.label.toLowerCase()}`}
              description="Crie uma lista acima e use este espaço para acompanhar o mês sem perder o histórico dos anteriores."
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ShoppingOverview({ lists }: { lists: ShoppingListSummary[] }) {
  const monthOptions = getShoppingMonthOptions(lists);
  const defaultMonth = monthOptions[0];
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const activeMonth = monthOptions.includes(selectedMonth)
    ? selectedMonth
    : defaultMonth;
  const monthlyLists = lists.filter((list) => list.monthKey === activeMonth);
  const groceryLists = monthlyLists.filter((list) => list.kind === "grocery");
  const plannedLists = monthlyLists.filter((list) => list.kind === "planned");
  const summary = buildShoppingMonthSummary(monthlyLists);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compras"
        title="Painel mensal de compras"
        description="Separe mercado e reposições das compras pontuais do mês, adicione itens rapidamente e volte depois para comparar com os meses anteriores."
      />

      <div className="border-border/70 bg-card/80 flex flex-wrap items-center gap-3 rounded-3xl border p-3 shadow-[0_12px_30px_-24px_rgba(52,35,122,0.3)]">
        <span className="text-sm font-medium text-slate-600">Mês</span>
        <Select
          value={activeMonth}
          onValueChange={(value) => {
            if (value) {
              setSelectedMonth(value);
            }
          }}
        >
          <SelectTrigger className="w-full max-w-xs rounded-2xl bg-white md:w-72">
            <SelectValue>{formatShoppingMonthLabel(activeMonth)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((monthOption) => (
              <SelectItem key={monthOption} value={monthOption}>
                {formatShoppingMonthLabel(monthOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ShoppingListForm selectedMonth={activeMonth} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 rounded-[28px] bg-white/85">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Estimado do mês
            </p>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(summary.totalEstimated)}
            </p>
            <p className="text-sm text-slate-500">
              Total previsto para {formatShoppingMonthLabel(activeMonth)}.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 rounded-[28px] bg-white/85">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Listas abertas
            </p>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              {summary.openLists}
            </p>
            <p className="text-sm text-slate-500">
              Listas que ainda não foram fechadas neste mês.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 rounded-[28px] bg-white/85">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Progresso dos itens
            </p>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              {summary.completedItems}/{summary.totalItems || 0}
            </p>
            <p className="text-sm text-slate-500">
              {summary.progress}% dos itens deste mês já foram marcados.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ShoppingLane kind="grocery" lists={groceryLists} />
        <ShoppingLane kind="planned" lists={plannedLists} />
      </div>
    </div>
  );
}

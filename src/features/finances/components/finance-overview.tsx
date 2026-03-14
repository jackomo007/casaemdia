"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { FinanceAreaChart } from "@/components/charts/finance-area-chart";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinanceEntriesTable } from "@/features/finances/components/finance-entries-table";
import { FinancePlanningSheet } from "@/features/finances/components/finance-planning-sheet";
import type { FinanceOverviewData } from "@/types";

function getMonthKey(dateValue: string) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getPlanningSheetKey(
  monthKey: string,
  entries: FinanceOverviewData["entries"],
) {
  return `${monthKey}:${entries
    .map((entry) => `${entry.id}:${entry.status}:${entry.amount}`)
    .join("|")}`;
}

export function FinanceOverview({
  data,
  referenceDate,
}: {
  data: FinanceOverviewData;
  referenceDate: string;
}) {
  const monthOptions = Array.from(
    new Set(
      data.entries.map((entry) =>
        getMonthKey(entry.competenceDate || entry.dueDate),
      ),
    ),
  ).sort((left, right) => right.localeCompare(left));
  const availableMonthOptions =
    monthOptions.length > 0
      ? monthOptions
      : [getMonthKey(new Date().toISOString())];
  const [selectedMonth, setSelectedMonth] = useState(availableMonthOptions[0]);
  const filteredEntries = data.entries.filter(
    (entry) =>
      getMonthKey(entry.competenceDate || entry.dueDate) === selectedMonth,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finanças"
        title="Controle financeiro da casa"
        description="Fluxo do mês com leitura rápida, planilha editável e foco no que ainda precisa ser pago."
      />

      <div className="border-border/70 bg-card/80 flex flex-wrap items-center gap-3 rounded-3xl border p-3 shadow-[0_12px_30px_-24px_rgba(52,35,122,0.3)]">
        <span className="text-sm font-medium text-slate-600">Mes</span>
        <Select
          value={selectedMonth}
          onValueChange={(value) => {
            if (value) {
              setSelectedMonth(value);
            }
          }}
        >
          <SelectTrigger className="w-full max-w-xs rounded-2xl bg-white md:w-72">
            <SelectValue placeholder="Selecione o mes" />
          </SelectTrigger>
          <SelectContent>
            {availableMonthOptions.map((monthOption) => (
              <SelectItem key={monthOption} value={monthOption}>
                {formatMonthLabel(monthOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FinancePlanningSheet
        key={getPlanningSheetKey(selectedMonth, filteredEntries)}
        referenceDate={referenceDate}
        currentEntries={filteredEntries}
      />

      <Card className="border-border/70 rounded-[32px] bg-white/85">
        <CardContent className="space-y-5 p-6">
          <SectionHeader
            title="Fluxo da casa"
            description="Comparativo de receitas, despesas e saldo acumulado."
          />
          <FinanceAreaChart data={data.monthlyFlow} />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <SectionHeader
          title="Visão planilha"
          description="Tabela inspirada em Excel/Sheets com foco em filtros, status e leitura rápida."
        />
        {filteredEntries.length ? (
          <FinanceEntriesTable
            entries={filteredEntries}
            monthLabel={formatMonthLabel(selectedMonth)}
          />
        ) : (
          <EmptyState
            title="Sua planilha ainda está vazia"
            description="Use a grade de preenchimento rápido acima para começar a montar seu mês."
          />
        )}
      </section>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { FinanceAreaChart } from "@/components/charts/finance-area-chart";
import { FinanceCategoryChart } from "@/components/charts/finance-category-chart";
import { FilterBar } from "@/components/shared/filter-bar";
import { FinancialSummaryCard } from "@/components/shared/financial-summary-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { SpreadsheetTable } from "@/components/shared/spreadsheet-table";
import { FinanceEntryForm } from "@/features/finances/components/finance-entry-form";
import { formatCurrency, formatLongDate } from "@/lib/utils/formatters";
import type { FinanceOverviewData } from "@/types";

export function FinanceOverview({ data }: { data: FinanceOverviewData }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financas"
        title="Controle financeiro da casa"
        description="Visao premium com cards e graficos, mais a leitura tabular tipo planilha para competencia e pagamento."
      />

      <FilterBar
        labels={[
          "Marco 2026",
          "Todos os membros",
          "Competencia",
          "Todas as categorias",
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <FinancialSummaryCard summary={data.summary} />
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Fluxo da casa"
              description="Comparativo de receitas, despesas e saldo acumulado."
            />
            <FinanceAreaChart data={data.monthlyFlow} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Pizza por categoria"
              description="Distribuicao das saidas principais da familia."
            />
            <FinanceCategoryChart data={data.categoryBreakdown} />
          </CardContent>
        </Card>
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Novo lancamento"
              description="Base pronta para evoluir com server actions, Prisma e conciliao."
            />
            <FinanceEntryForm />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Visao planilha"
          description="Tabela inspirada em Excel/Sheets com foco em filtros, status e leitura rapida."
        />
        <SpreadsheetTable
          data={data.entries}
          columns={[
            {
              key: "title",
              header: "Lancamento",
              render: (row) => (
                <div>
                  <p className="font-medium text-slate-950">{row.title}</p>
                  <p className="text-xs text-slate-400">{row.category}</p>
                </div>
              ),
            },
            { key: "member", header: "Membro", render: (row) => row.member },
            {
              key: "dueDate",
              header: "Vencimento",
              render: (row) => formatLongDate(row.dueDate),
            },
            {
              key: "amount",
              header: "Valor",
              render: (row) => (
                <span
                  className={
                    row.kind === "income" ? "text-emerald-600" : "text-rose-600"
                  }
                >
                  {row.kind === "income" ? "+" : "-"}{" "}
                  {formatCurrency(row.amount)}
                </span>
              ),
            },
            { key: "account", header: "Conta", render: (row) => row.account },
            { key: "status", header: "Status", render: (row) => row.status },
          ]}
        />
      </section>
    </div>
  );
}

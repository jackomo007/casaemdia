import Link from "next/link";

import { TrialBanner } from "@/components/billing/trial-banner";
import { EventCard } from "@/components/shared/event-card";
import { FinancialSummaryCard } from "@/components/shared/financial-summary-card";
import { InsightCard } from "@/components/shared/insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { ShoppingListCard } from "@/components/shared/shopping-list-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { TaskCard } from "@/components/shared/task-card";
import { Button } from "@/components/ui/button";
import type { AccessState, DashboardData } from "@/types";

export function DashboardOverview({
  data,
  access,
}: {
  data: DashboardData;
  access: AccessState;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visao do mes"
        title={`Bom te ver, ${data.greetingName}`}
        description={`O ${data.householdName} esta entrando em ${data.monthLabel} com rotina, dinheiro e compromissos centralizados.`}
        actions={
          <Button asChild className="rounded-2xl">
            <Link href="/select-plan">Planos</Link>
          </Button>
        }
      />

      <TrialBanner
        label={access.status}
        description={
          access.trialEndsAt
            ? `Acesso atual: ${access.status}. Trial termina em ${new Date(access.trialEndsAt).toLocaleDateString("pt-BR")}.`
            : "Assinatura ativa com acesso liberado para todos os modulos."
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="border-border/70 space-y-4 rounded-[32px] border bg-white/85 p-6 shadow-[0_24px_70px_-48px_rgba(80,64,153,0.32)]">
            <SectionHeader
              title="Proximos 7 dias"
              description="Compromissos escolares, medicos e financeiros priorizados."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {data.nextSevenDays.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
          <div className="border-border/70 space-y-4 rounded-[32px] border bg-white/85 p-6 shadow-[0_24px_70px_-48px_rgba(80,64,153,0.32)]">
            <SectionHeader
              title="Tarefas pendentes"
              description="Casa, filhos e pequenas operacoes que nao podem escapar."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {data.pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <FinancialSummaryCard summary={data.finance} />
          <div className="border-border/70 rounded-[32px] border bg-white/85 p-6 shadow-[0_24px_70px_-48px_rgba(80,64,153,0.32)]">
            <SectionHeader
              title="Alertas urgentes"
              description="Itens que merecem atencao antes de travar a semana."
            />
            <div className="mt-4 space-y-3">
              {data.alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={alert.href}
                  className="border-border/70 bg-muted/30 hover:bg-muted/60 flex items-start justify-between gap-4 rounded-3xl border p-4 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {alert.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {alert.description}
                    </p>
                  </div>
                  <StatusBadge
                    tone={alert.priority === "high" ? "danger" : "warning"}
                  >
                    {alert.priority}
                  </StatusBadge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="border-border/70 space-y-4 rounded-[32px] border bg-white/85 p-6 shadow-[0_24px_70px_-48px_rgba(80,64,153,0.32)]">
          <SectionHeader
            title="Compras pendentes"
            description="Listas ativas e custo estimado para a semana."
          />
          <div className="grid gap-4">
            {data.shoppingLists.map((list) => (
              <ShoppingListCard key={list.id} shoppingList={list} />
            ))}
          </div>
        </div>
        <div className="border-border/70 space-y-4 rounded-[32px] border bg-white/85 p-6 shadow-[0_24px_70px_-48px_rgba(80,64,153,0.32)]">
          <SectionHeader
            title="Recomendacoes da IA"
            description="Sugestoes educativas baseadas nos dados da familia."
          />
          <div className="grid gap-4">
            {data.insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

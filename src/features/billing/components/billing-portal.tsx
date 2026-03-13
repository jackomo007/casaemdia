import { BillingStatusChip } from "@/components/billing/billing-status-chip";
import { TrialBanner } from "@/components/billing/trial-banner";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { formatCurrency, formatLongDate } from "@/lib/utils/formatters";
import type { BillingState } from "@/types";

export function BillingPortal({ billing }: { billing: BillingState }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Billing"
        title="Portal interno de assinatura"
        description="Status atual, histórico simples, renovação e caminho para troca de plano."
      />
      <TrialBanner
        label={billing.planName}
        description={billing.renewalLabel}
      />
      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <Card className="border-border/70 rounded-[32px] bg-white/90">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="Assinatura"
              description="Estado atual da família"
            />
            <BillingStatusChip status={billing.status} />
            <div className="bg-muted/50 rounded-3xl p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-950">Plano atual</p>
              <p className="mt-1">{billing.planName}</p>
            </div>
            <div className="bg-muted/50 rounded-3xl p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-950">Próxima referência</p>
              <p className="mt-1">
                {billing.currentPeriodEnd
                  ? formatLongDate(billing.currentPeriodEnd)
                  : "Durante o trial"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 rounded-[32px] bg-white/90">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Histórico de cobranças"
              description="Mockado para Mercado Pago sandbox e reconciliação futura."
            />
            <div className="space-y-3">
              {billing.history.map((item) => (
                <div
                  key={item.id}
                  className="border-border/70 bg-muted/30 flex items-center justify-between rounded-3xl border px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-950">{item.label}</p>
                    <p className="text-sm text-slate-500">
                      {formatLongDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">
                      {formatCurrency(item.amount)}
                    </p>
                    <BillingStatusChip status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

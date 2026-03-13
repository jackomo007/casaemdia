import { Card, CardContent } from "@/components/ui/card";
import { LockedFeatureOverlay } from "@/components/billing/locked-feature-overlay";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { LiveInsightsPanel } from "@/features/ai-insights/components/live-insights-panel";
import type { AccessState } from "@/types";

export function InsightsOverview({ access }: { access: AccessState }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="IA e insights"
        title="Sugestoes educativas e sinais operacionais"
        description="Camada pronta para prompts, compliance leve e futura integracao com modelos reais."
      />
      {access.status === "ACTIVE" || access.status === "TRIALING" ? (
        <Card className="border-border/70 rounded-[32px] bg-white/90">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Painel vivo de insights"
              description="Consulta client-side via TanStack Query sobre a API interna."
            />
            <LiveInsightsPanel />
          </CardContent>
        </Card>
      ) : (
        <LockedFeatureOverlay
          title="Insights premium bloqueados"
          description="Ative um plano para continuar usando o motor de analise contextual da familia."
        />
      )}
    </div>
  );
}

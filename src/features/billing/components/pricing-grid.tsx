import { PlanCard } from "@/components/billing/plan-card";
import { PageHeader } from "@/components/shared/page-header";
import { SelectPlanButton } from "@/features/billing/components/select-plan-button";
import type { PlanDefinition } from "@/types";

export function PricingGrid({ plans }: { plans: PlanDefinition[] }) {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Planos"
        title="Assinatura sem fricção"
        description="O trial de 7 dias começa no cadastro. Depois disso, escolha o plano pago que melhor encaixa na rotina da família."
      />
      <div className="grid gap-5 xl:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            action={<SelectPlanButton planCode={plan.code} />}
          />
        ))}
      </div>
    </div>
  );
}

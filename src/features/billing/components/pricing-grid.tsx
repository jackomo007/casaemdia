import { PlanCard } from "@/components/billing/plan-card";
import { PageHeader } from "@/components/shared/page-header";
import { SelectPlanButton } from "@/features/billing/components/select-plan-button";
import type { PlanDefinition } from "@/types";

export function PricingGrid({ plans }: { plans: PlanDefinition[] }) {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Planos"
        title="Assinatura sem friccao"
        description="7 dias gratis sem cartao e upgrade 100% self-service quando a familia estiver pronta."
      />
      <div className="grid gap-5 xl:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            action={
              plan.code === "TRIAL" ? (
                <SelectPlanButton planCode="FAMILY" label="Comecar com trial" />
              ) : (
                <SelectPlanButton planCode={plan.code} />
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

import { PricingGrid } from "@/features/billing/components/pricing-grid";
import { getPlanCatalog } from "@/server/services/billing-service";

export default async function SelectPlanPage() {
  const plans = await getPlanCatalog();
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PricingGrid plans={plans} />
      </div>
    </main>
  );
}

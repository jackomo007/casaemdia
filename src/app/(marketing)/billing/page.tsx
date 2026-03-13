import { BillingPortal } from "@/features/billing/components/billing-portal";
import { getBillingState } from "@/server/services/billing-service";

export default async function BillingPage() {
  const billing = await getBillingState();
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <BillingPortal billing={billing} />
      </div>
    </main>
  );
}

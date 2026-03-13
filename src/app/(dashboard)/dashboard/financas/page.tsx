import { FinanceOverview } from "@/features/finances/components/finance-overview";
import { getFinanceOverview } from "@/server/services/finance-service";

export default async function FinancePage() {
  const data = await getFinanceOverview();
  return (
    <FinanceOverview data={data} referenceDate={new Date().toISOString()} />
  );
}

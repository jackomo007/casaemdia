import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getAccessState } from "@/lib/auth/session";
import { getDashboardData } from "@/server/services/dashboard-service";

export default async function DashboardPage() {
  const [data, access] = await Promise.all([
    getDashboardData(),
    getAccessState(),
  ]);
  return <DashboardOverview data={data} access={access} />;
}

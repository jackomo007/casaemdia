import { HealthOverview } from "@/features/health/components/health-overview";
import { getHealthReminders } from "@/server/services/health-service";

export default async function HealthPage() {
  const reminders = await getHealthReminders();
  return <HealthOverview reminders={reminders} />;
}

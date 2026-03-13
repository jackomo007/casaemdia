import { InsightsOverview } from "@/features/ai-insights/components/insights-overview";
import { getAccessState } from "@/lib/auth/session";

export default async function InsightsPage() {
  const access = await getAccessState();
  return <InsightsOverview access={access} />;
}

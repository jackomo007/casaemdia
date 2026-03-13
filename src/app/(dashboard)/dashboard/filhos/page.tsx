import { ChildrenOverview } from "@/features/children/components/children-overview";
import { getChildrenSummaries } from "@/server/services/children-service";

export default async function ChildrenPage() {
  const children = await getChildrenSummaries();
  return <ChildrenOverview items={children} />;
}

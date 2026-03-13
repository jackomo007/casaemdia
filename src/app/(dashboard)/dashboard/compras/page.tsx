import { ShoppingOverview } from "@/features/shopping/components/shopping-overview";
import { getShoppingLists } from "@/server/services/shopping-service";

export default async function ShoppingPage() {
  const lists = await getShoppingLists();
  return <ShoppingOverview lists={lists} />;
}

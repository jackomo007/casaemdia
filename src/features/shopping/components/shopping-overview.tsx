import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { ShoppingListCard } from "@/components/shared/shopping-list-card";
import { Card, CardContent } from "@/components/ui/card";
import type { ShoppingListSummary } from "@/types";

export function ShoppingOverview({ lists }: { lists: ShoppingListSummary[] }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compras"
        title="Mercado, eventos e recorrencias"
        description="Listas multiplas com progresso, custo estimado e potencial de conversao em lembretes."
      />
      <Card className="border-border/70 rounded-[32px] bg-white/85">
        <CardContent className="space-y-5 p-6">
          <SectionHeader
            title="Listas ativas"
            description="Integradas visualmente com o contexto financeiro."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {lists.map((list) => (
              <ShoppingListCard key={list.id} shoppingList={list} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

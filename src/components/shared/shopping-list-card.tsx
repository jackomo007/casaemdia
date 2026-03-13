import { ShoppingBasket } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/formatters";
import type { ShoppingListSummary } from "@/types";

export function ShoppingListCard({
  shoppingList,
}: {
  shoppingList: ShoppingListSummary;
}) {
  return (
    <Card className="border-border/70 rounded-[24px] bg-white/90 shadow-[0_18px_46px_-36px_rgba(80,64,153,0.3)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              {shoppingList.category}
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-950">
              {shoppingList.title}
            </h3>
          </div>
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-2xl">
            <ShoppingBasket className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{shoppingList.progress}% concluido</span>
            <span>{formatCurrency(shoppingList.estimatedTotal)}</span>
          </div>
          <Progress
            value={shoppingList.progress}
            className="h-2 rounded-full"
          />
        </div>
        <div className="space-y-2">
          {shoppingList.items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-600">{item.name}</span>
              <span
                className={item.checked ? "text-emerald-600" : "text-slate-400"}
              >
                {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

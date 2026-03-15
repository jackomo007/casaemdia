"use client";

import { useRouter } from "next/navigation";
import { ShoppingBasket } from "lucide-react";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/formatters";
import type { ShoppingListSummary } from "@/types";
import {
  createShoppingListItemAction,
  updateShoppingListItemStatusAction,
} from "@/server/actions/shopping-actions";

export function ShoppingListPanel({ list }: { list: ShoppingListSummary }) {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startSubmitTransition(async () => {
      try {
        await createShoppingListItemAction({
          shoppingListId: list.id,
          name: itemName,
          quantity,
          estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
        });

        toast.success("Item adicionado.");
        router.refresh();
        setItemName("");
        setQuantity("");
        setEstimatedCost("");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível adicionar o item.",
        );
      }
    });
  }

  function handleCheckedChange(itemId: string, checked: boolean) {
    startToggleTransition(async () => {
      try {
        await updateShoppingListItemStatusAction({ id: itemId, checked });
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o item.",
        );
      }
    });
  }

  return (
    <Card className="border-border/70 rounded-[28px] bg-white/90 shadow-[0_18px_46px_-36px_rgba(80,64,153,0.22)]">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase">
                {list.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                {list.completedItems}/{list.itemCount || 0} itens
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                {list.title}
              </h3>
              {list.description ? (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {list.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
            <ShoppingBasket className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{list.progress}% concluído</span>
            <span>{formatCurrency(list.estimatedTotal)}</span>
          </div>
          <Progress value={list.progress} className="h-2 rounded-full" />
        </div>

        <div className="space-y-3">
          {list.items.length ? (
            list.items.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 px-3 py-3"
              >
                <Checkbox
                  checked={item.checked}
                  disabled={isToggling}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(item.id, Boolean(checked))
                  }
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={
                        item.checked
                          ? "text-sm font-medium text-emerald-700 line-through"
                          : "text-sm font-medium text-slate-800"
                      }
                    >
                      {item.name}
                    </span>
                    {item.estimatedCost > 0 ? (
                      <span className="text-xs font-medium text-slate-500">
                        {formatCurrency(item.estimatedCost)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.quantity}</p>
                </div>
              </label>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm leading-6 text-slate-500">
              Lista criada. Agora adicione os itens que você quer acompanhar
              neste mês.
            </div>
          )}
        </div>

        <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
          <Input
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="Novo item"
            required
            className="rounded-2xl md:col-span-2"
          />
          <Input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Qtd. ou medida"
            className="rounded-2xl"
          />
          <Input
            value={estimatedCost}
            onChange={(event) => setEstimatedCost(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor estimado"
            className="rounded-2xl md:col-span-2"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="outline"
            className="h-11 rounded-2xl"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

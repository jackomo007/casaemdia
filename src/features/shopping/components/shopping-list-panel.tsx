"use client";

import { useRouter } from "next/navigation";
import { ShoppingBasket, Trash2 } from "lucide-react";
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
  deleteShoppingListAction,
  deleteShoppingListItemAction,
  updateShoppingListItemStatusAction,
} from "@/server/actions/shopping-actions";

export function ShoppingListPanel({ list }: { list: ShoppingListSummary }) {
  const router = useRouter();
  const [items, setItems] = useState(list.items);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isDeletingItem, startDeleteItemTransition] = useTransition();
  const [confirmDeleteList, setConfirmDeleteList] = useState(false);
  const itemCount = items.length;
  const completedItems = items.filter((item) => item.checked).length;
  const checkedItemsCost = items
    .filter((item) => item.checked)
    .reduce((total, item) => total + item.estimatedCost, 0);
  const totalItemsCost = items.reduce(
    (total, item) => total + item.estimatedCost,
    0,
  );
  const remainingBudget = list.estimatedTotal - totalItemsCost;
  const isOverBudget = remainingBudget < 0;
  const progress =
    list.estimatedTotal > 0
      ? Math.min(
          100,
          Math.round((checkedItemsCost / list.estimatedTotal) * 100),
        )
      : itemCount > 0
        ? Math.round((completedItems / itemCount) * 100)
        : 0;

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
    const previousItems = items;
    const nextItems = items.map((item) =>
      item.id === itemId ? { ...item, checked } : item,
    );

    setItems(nextItems);
    startToggleTransition(async () => {
      try {
        await updateShoppingListItemStatusAction({ id: itemId, checked });
        router.refresh();
      } catch (error) {
        setItems(previousItems);
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o item.",
        );
      }
    });
  }

  function handleDeleteList() {
    startDeleteTransition(async () => {
      try {
        await deleteShoppingListAction({ id: list.id });
        toast.success("Lista apagada.");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível apagar a lista.",
        );
      }
    });
  }

  function handleDeleteItem(itemId: string) {
    const previousItems = items;
    const nextItems = items.filter((item) => item.id !== itemId);

    setItems(nextItems);
    startDeleteItemTransition(async () => {
      try {
        await deleteShoppingListItemAction({ id: itemId });
        toast.success("Item apagado.");
        router.refresh();
      } catch (error) {
        setItems(previousItems);
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível apagar o item.",
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
                {completedItems}/{itemCount || 0} itens
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
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={isDeleting}
              className="rounded-2xl text-slate-500 hover:text-red-600"
              onClick={() => setConfirmDeleteList((current) => !current)}
              aria-label={`Apagar lista ${list.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
              <ShoppingBasket className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              {list.estimatedTotal > 0
                ? `${progress}% do orçamento usado`
                : `${progress}% concluído`}
            </span>
            <span>{formatCurrency(list.estimatedTotal)}</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">
              Itens somados: {formatCurrency(totalItemsCost)}
            </span>
            <span
              className={
                isOverBudget ? "font-semibold text-red-600" : "text-emerald-700"
              }
            >
              {isOverBudget
                ? `Ultrapassou ${formatCurrency(Math.abs(remainingBudget))}`
                : `Ainda restam ${formatCurrency(remainingBudget)}`}
            </span>
          </div>
          {list.estimatedTotal > 0 ? (
            <p className="text-xs text-slate-500">
              Marcados como comprados: {formatCurrency(checkedItemsCost)}
            </p>
          ) : null}
        </div>

        {confirmDeleteList ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              Apagar a lista inteira e todos os itens dela?
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-2xl"
                onClick={() => setConfirmDeleteList(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={isDeleting}
                className="rounded-2xl"
                onClick={handleDeleteList}
              >
                {isDeleting ? "Apagando..." : "Apagar lista"}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 px-3 py-3"
              >
                <Checkbox
                  checked={item.checked}
                  disabled={isToggling || isDeletingItem}
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
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={isDeletingItem}
                  className="rounded-2xl text-slate-400 hover:text-red-600"
                  onClick={() => handleDeleteItem(item.id)}
                  aria-label={`Apagar item ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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

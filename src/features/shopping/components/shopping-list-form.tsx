"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatShoppingMonthLabel } from "@/features/shopping/lib/shopping";
import type { ShoppingListKind } from "@/types";
import { createShoppingListAction } from "@/server/actions/shopping-actions";

export function ShoppingListForm({ selectedMonth }: { selectedMonth: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [kind, setKind] = useState<ShoppingListKind>("grocery");
  const [estimatedTotal, setEstimatedTotal] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await createShoppingListAction({
          title,
          category,
          kind,
          monthKey: selectedMonth,
          estimatedTotal: estimatedTotal ? Number(estimatedTotal) : undefined,
          description,
        });

        toast.success("Lista criada.");
        router.refresh();
        setTitle("");
        setCategory("");
        setKind("grocery");
        setEstimatedTotal("");
        setDescription("");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível criar a lista.",
        );
      }
    });
  }

  return (
    <Card className="border-border/70 rounded-[32px] bg-white/90 shadow-[0_18px_46px_-36px_rgba(80,64,153,0.25)]">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Nova lista do mês
          </p>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Organize {formatShoppingMonthLabel(selectedMonth)}
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Crie uma lista para mercado, farmácia, escola ou compras maiores
              do mês sem misturar tudo no mesmo lugar.
            </p>
          </div>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shopping-title">Título da lista</Label>
            <Input
              id="shopping-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Mercado do mês, Volta às aulas, Quarto de visitas"
              required
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopping-category">Categoria</Label>
            <Input
              id="shopping-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Ex.: Casa, Escola, Mercado, Convidados"
              required
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de compra</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={kind === "grocery" ? "default" : "outline"}
                className="h-11 rounded-2xl"
                onClick={() => setKind("grocery")}
              >
                Mercado e rotina
              </Button>
              <Button
                type="button"
                variant={kind === "planned" ? "default" : "outline"}
                className="h-11 rounded-2xl"
                onClick={() => setKind("planned")}
              >
                Compra pontual
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopping-total">Estimativa total</Label>
            <Input
              id="shopping-total"
              type="number"
              min="0"
              step="0.01"
              value={estimatedTotal}
              onChange={(event) => setEstimatedTotal(event.target.value)}
              placeholder="0,00"
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shopping-description">Observação</Label>
            <Textarea
              id="shopping-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Use para anotar contexto do mês, prioridade ou o motivo da compra."
              className="rounded-2xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-2xl md:col-span-2"
          >
            {isPending ? "Salvando..." : "Criar lista de compras"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

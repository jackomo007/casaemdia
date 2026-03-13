"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  financeEntrySchema,
  type FinanceEntrySchema,
} from "@/lib/validations/finance";
import { createFinanceEntryAction } from "@/server/actions/finance-actions";

export function FinanceEntryForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<FinanceEntrySchema>({
    resolver: zodResolver(financeEntrySchema) as Resolver<FinanceEntrySchema>,
    defaultValues: {
      title: "Supermercado do fim de semana",
      amount: 245.9,
      kind: "expense",
      category: "Alimentacao",
      member: "Marina",
      dueDate: "2026-03-22",
      competenceDate: "2026-03-01",
      account: "Conta principal",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createFinanceEntryAction(values);
      toast.success("Lancamento salvo.");
      router.refresh();
      form.reset();
    });
  });

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="finance-title">Titulo</Label>
        <Input
          id="finance-title"
          {...form.register("title")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="finance-amount">Valor</Label>
        <Input
          id="finance-amount"
          type="number"
          step="0.01"
          {...form.register("amount")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <Select
          defaultValue={form.getValues("kind")}
          onValueChange={(value) =>
            form.setValue("kind", value as FinanceEntrySchema["kind"])
          }
        >
          <SelectTrigger className="rounded-2xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Receita</SelectItem>
            <SelectItem value="expense">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="finance-category">Categoria</Label>
        <Input
          id="finance-category"
          {...form.register("category")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="finance-member">Membro</Label>
        <Input
          id="finance-member"
          {...form.register("member")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="finance-due">Vencimento</Label>
        <Input
          id="finance-due"
          type="date"
          {...form.register("dueDate")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="finance-competence">Competencia</Label>
        <Input
          id="finance-competence"
          type="date"
          {...form.register("competenceDate")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="finance-account">Conta</Label>
        <Input
          id="finance-account"
          {...form.register("account")}
          className="rounded-2xl"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-2xl md:col-span-2"
      >
        {isPending ? "Salvando..." : "Criar lancamento"}
      </Button>
    </form>
  );
}

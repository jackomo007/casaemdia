"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calendarEventSchema,
  type CalendarEventSchema,
} from "@/lib/validations/calendar";
import { createCalendarEventAction } from "@/server/actions/calendar-actions";
import type { CalendarEventItem } from "@/types";

function getDefaultStartsAt(referenceDate: string) {
  const [datePart = ""] = referenceDate.split("T");
  return `${datePart}T09:00`;
}

export function CalendarEventForm({
  onCreated,
  referenceDate,
}: {
  onCreated?: (events: CalendarEventItem[]) => void;
  referenceDate: string;
}) {
  const [isPending, startTransition] = useTransition();
  const defaultStartsAt = getDefaultStartsAt(referenceDate);
  const form = useForm<CalendarEventSchema>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startsAt: defaultStartsAt,
      kind: "school",
      priority: "medium",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createCalendarEventAction(values);

      if (!result.success) {
        toast.error("Não foi possível criar o evento.");
        return;
      }

      onCreated?.(result.events);
      toast.success("Evento adicionado.");
      form.reset({
        title: "",
        description: "",
        startsAt: defaultStartsAt,
        kind: "school",
        priority: "medium",
      });
    });
  });

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="event-title">Título</Label>
        <Input
          id="event-title"
          {...form.register("title")}
          className="rounded-2xl"
          placeholder="Ex.: Reunião da escola ou vencimento importante"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-startsAt">Data e hora</Label>
        <Input
          id="event-startsAt"
          type="datetime-local"
          {...form.register("startsAt")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <select
          {...form.register("kind")}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-11 w-full rounded-2xl border bg-white px-3 text-sm outline-none focus-visible:ring-3"
        >
          <option value="school">Escola</option>
          <option value="medical">Saúde</option>
          <option value="billing">Financeiro</option>
          <option value="family">Família</option>
          <option value="shopping">Compras</option>
          <option value="task">Tarefa</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Prioridade</Label>
        <select
          {...form.register("priority")}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-11 w-full rounded-2xl border bg-white px-3 text-sm outline-none focus-visible:ring-3"
        >
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-2xl md:col-span-2"
      >
        {isPending ? "Salvando..." : "Criar evento"}
      </Button>
    </form>
  );
}

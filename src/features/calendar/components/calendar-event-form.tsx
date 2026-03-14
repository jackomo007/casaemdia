"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  calendarEventSchema,
  type CalendarEventSchema,
} from "@/lib/validations/calendar";
import { createCalendarEventAction } from "@/server/actions/calendar-actions";

export function CalendarEventForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CalendarEventSchema>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startsAt: "",
      kind: "school",
      priority: "medium",
    },
  });
  const kind = useWatch({ control: form.control, name: "kind" });
  const priority = useWatch({ control: form.control, name: "priority" });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createCalendarEventAction(values);
      toast.success("Evento adicionado.");
      router.refresh();
      form.reset();
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
        <Select
          value={kind}
          onValueChange={(value) =>
            form.setValue("kind", value as CalendarEventSchema["kind"])
          }
        >
          <SelectTrigger className="rounded-2xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school">Escola</SelectItem>
            <SelectItem value="medical">Saúde</SelectItem>
            <SelectItem value="billing">Financeiro</SelectItem>
            <SelectItem value="family">Família</SelectItem>
            <SelectItem value="shopping">Compras</SelectItem>
            <SelectItem value="task">Tarefa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Prioridade</Label>
        <Select
          value={priority}
          onValueChange={(value) =>
            form.setValue("priority", value as CalendarEventSchema["priority"])
          }
        >
          <SelectTrigger className="rounded-2xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
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

"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/shared/event-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { CalendarEventForm } from "@/features/calendar/components/calendar-event-form";
import { deleteCalendarEventAction } from "@/server/actions/calendar-actions";
import type { CalendarEventItem } from "@/types";

type AgendaFilter = "week" | string;

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(date: Date) {
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getRemainingMonths(referenceDate: Date) {
  return Array.from({ length: 12 - referenceDate.getMonth() }, (_, index) => {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() + index,
      1,
    );

    return {
      value: getMonthKey(date),
      label: formatMonthLabel(date),
    };
  });
}

function isInSelectedFilter(
  event: CalendarEventItem,
  filter: AgendaFilter,
  referenceDate: Date,
) {
  const eventDate = new Date(event.startsAt);

  if (filter !== "week") {
    return getMonthKey(eventDate) === filter;
  }

  const endOfWeek = new Date(referenceDate);
  endOfWeek.setDate(referenceDate.getDate() + 7);

  return eventDate >= referenceDate && eventDate <= endOfWeek;
}

export function CalendarOverview({
  events,
  referenceDate,
}: {
  events: CalendarEventItem[];
  referenceDate: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [liveEvents, setLiveEvents] = useState(events);
  const currentDate = new Date(referenceDate);
  const monthOptions = getRemainingMonths(currentDate);
  const defaultFilter = monthOptions[0]?.value ?? "week";
  const [selectedFilter, setSelectedFilter] =
    useState<AgendaFilter>(defaultFilter);
  const filteredEvents = liveEvents.filter((event) =>
    isInSelectedFilter(event, selectedFilter, currentDate),
  );
  const selectedLabel =
    selectedFilter === "week"
      ? "Semana"
      : (monthOptions.find((option) => option.value === selectedFilter)
          ?.label ?? "Mês");

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCalendarEventAction({ id });

      if (!result.success) {
        toast.error("Não foi possível apagar o evento.");
        return;
      }

      setLiveEvents(result.events);
      toast.success("Evento apagado.");
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda familiar"
        title="Compromissos e prioridades da casa"
        description="A agenda centraliza eventos, tarefas e lembretes importantes no mesmo fluxo."
      />
      <div className="border-border/70 bg-card/80 flex flex-wrap items-center gap-3 rounded-3xl border p-3 shadow-[0_12px_30px_-24px_rgba(52,35,122,0.3)]">
        <Button
          type="button"
          variant={selectedFilter === "week" ? "default" : "outline"}
          className="rounded-2xl"
          onClick={() => setSelectedFilter("week")}
        >
          Semana
        </Button>
        {monthOptions.map((monthOption) => (
          <Button
            key={monthOption.value}
            type="button"
            variant={
              selectedFilter === monthOption.value ? "default" : "outline"
            }
            className="rounded-2xl"
            onClick={() => setSelectedFilter(monthOption.value)}
          >
            {monthOption.label}
          </Button>
        ))}
        <span className="text-sm text-slate-500">
          {filteredEvents.length} item(ns) em {selectedLabel}
        </span>
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Linha do tempo"
              description="Tudo o que precisa acontecer primeiro na rotina da casa."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    actions={
                      event.canDelete ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={isPending}
                          aria-label={`Apagar ${event.title}`}
                          className="rounded-2xl"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : undefined
                    }
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhum evento encontrado em {selectedLabel.toLowerCase()}.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Criar evento"
              description="Use para compromissos, contas, tarefas ou lembretes com prioridade."
            />
            <CalendarEventForm
              onCreated={setLiveEvents}
              referenceDate={referenceDate}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

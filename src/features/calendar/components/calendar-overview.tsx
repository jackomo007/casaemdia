"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/shared/event-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { CalendarEventForm } from "@/features/calendar/components/calendar-event-form";
import type { CalendarEventItem } from "@/types";

type AgendaView = "month" | "week";

function isInSelectedView(event: CalendarEventItem, view: AgendaView) {
  const currentDate = new Date();
  const eventDate = new Date(event.startsAt);

  if (view === "month") {
    return (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    );
  }

  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() + 7);

  return eventDate >= currentDate && eventDate <= endOfWeek;
}

export function CalendarOverview({ events }: { events: CalendarEventItem[] }) {
  const [view, setView] = useState<AgendaView>("month");
  const filteredEvents = events.filter((event) =>
    isInSelectedView(event, view),
  );

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
          variant={view === "month" ? "default" : "outline"}
          className="rounded-2xl"
          onClick={() => setView("month")}
        >
          Mes
        </Button>
        <Button
          type="button"
          variant={view === "week" ? "default" : "outline"}
          className="rounded-2xl"
          onClick={() => setView("week")}
        >
          Semana
        </Button>
        <span className="text-sm text-slate-500">
          {filteredEvents.length} item(ns) nesta visualizacao
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
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Criar evento"
              description="Use para compromissos, contas, tarefas ou lembretes com prioridade."
            />
            <CalendarEventForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

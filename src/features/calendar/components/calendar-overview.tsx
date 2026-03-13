import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/shared/event-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CalendarEventForm } from "@/features/calendar/components/calendar-event-form";
import type { CalendarEventItem } from "@/types";

export function CalendarOverview({ events }: { events: CalendarEventItem[] }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda familiar"
        title="Compromissos da casa, da escola e da saude"
        description="Views de mes, semana e lista podem crescer daqui sem refatorar a base de dominio."
      />
      <FilterBar labels={["Mes", "Semana", "Agenda", "Todas as criancas"]} />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Linha do tempo"
              description="Proximos eventos da rotina familiar."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Criar evento"
              description="Ideal para escola, pagamento, consultas e compromissos do casal."
            />
            <CalendarEventForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

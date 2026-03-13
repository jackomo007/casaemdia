import { CalendarOverview } from "@/features/calendar/components/calendar-overview";
import { getCalendarEvents } from "@/server/services/calendar-service";

export default async function AgendaPage() {
  const events = await getCalendarEvents();
  return <CalendarOverview events={events} />;
}

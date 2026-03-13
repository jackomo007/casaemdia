import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { formatDateTime } from "@/lib/utils/formatters";
import type { HealthReminder } from "@/types";

export function HealthOverview({ reminders }: { reminders: HealthReminder[] }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Saude"
        title="Vacinas, consultas e registros"
        description="Base pronta para historico medico, alergias, anexos e alertas recorrentes."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className="border-border/70 rounded-[32px] bg-white/90"
          >
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title={reminder.title}
                description={reminder.childName ?? "Familia"}
              />
              <p className="text-sm leading-6 text-slate-600">
                {reminder.description}
              </p>
              <div className="bg-primary/5 text-primary rounded-3xl px-4 py-3 text-sm font-medium">
                {formatDateTime(reminder.dueDate)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

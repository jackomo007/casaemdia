import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { getUserSettings } from "@/server/services/settings-service";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuracoes"
        title="Preferencias, permissoes e base da conta"
        description="Espaco para evoluir roles por household, notificacoes e ajustes pessoais."
      />
      <Card className="border-border/70 rounded-[32px] bg-white/90">
        <CardContent className="space-y-5 p-6">
          <SectionHeader
            title="Preferencias atuais"
            description="Valores iniciais prontos para persistencia futura."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-muted/50 rounded-3xl p-4">
              <p className="text-sm font-medium text-slate-950">Locale</p>
              <p className="mt-1 text-sm text-slate-500">{settings.locale}</p>
            </div>
            <div className="bg-muted/50 rounded-3xl p-4">
              <p className="text-sm font-medium text-slate-950">Timezone</p>
              <p className="mt-1 text-sm text-slate-500">{settings.timezone}</p>
            </div>
            <div className="bg-muted/50 rounded-3xl p-4">
              <p className="text-sm font-medium text-slate-950">Notificacoes</p>
              <p className="mt-1 text-sm text-slate-500">
                {settings.notificationsEnabled ? "Ativas" : "Pausadas"}
              </p>
            </div>
            <div className="bg-muted/50 rounded-3xl p-4">
              <p className="text-sm font-medium text-slate-950">Insights IA</p>
              <p className="mt-1 text-sm text-slate-500">
                {settings.aiInsightsEnabled ? "Ativos" : "Desativados"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

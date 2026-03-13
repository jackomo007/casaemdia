import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import type { ChildSummary } from "@/types";

export function ChildrenOverview({ items }: { items: ChildSummary[] }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Filhos e escola"
        title="Tudo o que gira em torno das criancas"
        description="Eventos escolares, materiais, uniforme, tarefas e datas importantes em uma visao acolhedora."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((child) => (
          <Card
            key={child.id}
            className="border-border/70 rounded-[32px] bg-white/90"
          >
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title={child.name}
                description={`${child.age} anos • ${child.school}`}
              />
              <div className="grid gap-3 text-sm text-slate-600">
                <div className="bg-muted/50 rounded-3xl p-4">
                  <p className="font-medium text-slate-950">Proximo marco</p>
                  <p className="mt-1">{child.nextEvent}</p>
                </div>
                <div className="bg-muted/50 rounded-3xl p-4">
                  <p className="font-medium text-slate-950">Pendencias</p>
                  <p className="mt-1">{child.pendingTasks} tarefas em aberto</p>
                </div>
                <div className="bg-primary/5 text-primary rounded-3xl p-4">
                  <p className="font-medium">Nota pratica</p>
                  <p className="mt-1">{child.note}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { TaskCard } from "@/components/shared/task-card";
import { TaskForm } from "@/features/tasks/components/task-form";
import type { TaskItem } from "@/types";

export function TasksOverview({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tarefas"
        title="Casa e filhos em fluxo continuo"
        description="Prioridades, pontos, recorrencia e atribuicao ja preparados para evolucao do modulo."
      />
      <FilterBar
        labels={["Todas", "Alta prioridade", "Recorrentes", "Criancas"]}
      />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Quadro de tarefas"
              description="Lista enxuta para o que precisa acontecer nos proximos dias."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 rounded-[32px] bg-white/85">
          <CardContent className="space-y-5 p-6">
            <SectionHeader
              title="Nova tarefa"
              description="Crie tarefas da casa ou missões das criancas com pontos opcionais."
            />
            <TaskForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

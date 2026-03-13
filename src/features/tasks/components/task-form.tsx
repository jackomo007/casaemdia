"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
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
import { taskSchema, type TaskSchema } from "@/lib/validations/task";
import { createTaskAction } from "@/server/actions/task-actions";

export function TaskForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema) as Resolver<TaskSchema>,
    defaultValues: {
      title: "Separar uniforme da semana",
      description: "Revisar meias, camiseta azul e agasalho leve.",
      dueDate: "2026-03-18",
      priority: "medium",
      assignee: "Marina",
      points: 10,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createTaskAction(values);
      toast.success("Tarefa criada.");
      router.refresh();
      form.reset();
    });
  });

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="task-title">Titulo</Label>
        <Input
          id="task-title"
          {...form.register("title")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="task-description">Descricao</Label>
        <Input
          id="task-description"
          {...form.register("description")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-dueDate">Vencimento</Label>
        <Input
          id="task-dueDate"
          type="date"
          {...form.register("dueDate")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Prioridade</Label>
        <Select
          defaultValue={form.getValues("priority")}
          onValueChange={(value) =>
            form.setValue("priority", value as TaskSchema["priority"])
          }
        >
          <SelectTrigger className="rounded-2xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-assignee">Responsavel</Label>
        <Input
          id="task-assignee"
          {...form.register("assignee")}
          className="rounded-2xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-points">Pontos</Label>
        <Input
          id="task-points"
          type="number"
          {...form.register("points")}
          className="rounded-2xl"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-2xl md:col-span-2"
      >
        {isPending ? "Salvando..." : "Criar tarefa"}
      </Button>
    </form>
  );
}

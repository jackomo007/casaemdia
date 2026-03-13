"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  loginSchema,
  registerSchema,
  type LoginSchema,
} from "@/lib/validations/auth";
import { signInAction, signUpAction } from "@/server/actions/auth-actions";

type Mode = "login" | "register";
type AuthFormValues = {
  fullName?: string;
  email: string;
  password: string;
  scenario: LoginSchema["scenario"];
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = mode === "login" ? loginSchema : registerSchema;
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema) as Resolver<AuthFormValues>,
    defaultValues:
      mode === "login"
        ? {
            email: "marina@familiaoliveira.com.br",
            password: "123456",
            scenario: "trialing",
          }
        : {
            fullName: "Marina Oliveira",
            email: "marina@familiaoliveira.com.br",
            password: "123456",
            scenario: "trialing",
          },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const action = mode === "login" ? signInAction : signUpAction;
      const result = await action(values);

      if (!result.success) {
        toast.error(result.message ?? "Nao foi possivel continuar.");
        return;
      }

      toast.success(
        mode === "login" ? "Acesso liberado." : "Conta criada com sucesso.",
      );
      if (!result.redirectTo) {
        return;
      }
      router.push(
        result.redirectTo as "/dashboard" | "/onboarding" | "/billing/locked",
      );
      router.refresh();
    });
  });

  return (
    <Card className="rounded-[32px] border-white/80 bg-white/95 shadow-[0_30px_90px_-60px_rgba(80,64,153,0.42)]">
      <CardContent className="p-6 md:p-8">
        <div className="mb-8 space-y-3">
          <span className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </span>
          <h1 className="font-display text-3xl font-semibold text-slate-950">
            {mode === "login"
              ? "Acesse sua familia"
              : "Comece o trial de 7 dias"}
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            Sem cartao para iniciar. Em modo demo, voce pode testar tambem
            cenarios de assinatura.
          </p>
        </div>
        <form className="space-y-5" onSubmit={onSubmit}>
          {mode === "register" ? (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                {...form.register("fullName")}
                className="rounded-2xl"
              />
              <p className="text-xs text-rose-500">
                {form.formState.errors.fullName?.message}
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              {...form.register("email")}
              className="rounded-2xl"
            />
            <p className="text-xs text-rose-500">
              {form.formState.errors.email?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              className="rounded-2xl"
            />
            <p className="text-xs text-rose-500">
              {form.formState.errors.password?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cenario demo</Label>
            <Select
              defaultValue={form.getValues("scenario")}
              onValueChange={(value) =>
                form.setValue("scenario", value as LoginSchema["scenario"])
              }
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trialing">Trial ativo</SelectItem>
                <SelectItem value="active">Assinatura ativa</SelectItem>
                <SelectItem value="past_due">Pagamento pendente</SelectItem>
                <SelectItem value="expired">Trial expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-2xl"
          >
            {isPending
              ? "Processando..."
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          {mode === "login" ? (
            <>
              <Link href="/register" className="text-primary font-medium">
                Criar uma conta
              </Link>
              <Link
                href="/forgot-password"
                className="text-primary font-medium"
              >
                Recuperar senha
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-primary font-medium">
              Ja tenho conta
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

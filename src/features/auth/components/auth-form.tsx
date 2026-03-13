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
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { signInAction, signUpAction } from "@/server/actions/auth-actions";

type Mode = "login" | "register";
type AuthFormValues = {
  fullName?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = mode === "login" ? loginSchema : registerSchema;
  const isLogin = mode === "login";
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema) as Resolver<AuthFormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const action = mode === "login" ? signInAction : signUpAction;
      const result = await action(values);

      if (!result.success) {
        toast.error(result.message ?? "Não foi possível continuar.");
        return;
      }

      toast.success(
        mode === "login" ? "Acesso liberado." : "Conta criada com sucesso.",
      );
      if (!result.redirectTo) {
        return;
      }
      router.push(
        result.redirectTo as
          | "/dashboard"
          | "/dashboard/financas"
          | "/onboarding"
          | "/billing/locked",
      );
      router.refresh();
    });
  });

  return (
    <Card className="rounded-[32px] border-white/80 bg-white/95 shadow-[0_30px_90px_-60px_rgba(80,64,153,0.42)]">
      <CardContent className="p-6 md:p-8">
        <div className="mb-8 space-y-3">
          <span className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
            {isLogin ? "Entrar" : "Criar conta"}
          </span>
          <h1 className="font-display text-3xl font-semibold text-slate-950">
            {isLogin ? "Acesse sua família" : "Comece com tudo em branco"}
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            Sem cartão para iniciar. Crie sua conta e comece com a base vazia
            para preencher do seu jeito.
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
                placeholder="Seu nome"
                autoComplete="name"
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
              placeholder="voce@exemplo.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
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
              placeholder={
                isLogin
                  ? "Digite sua senha"
                  : "Mínimo de 8 caracteres com letra e número"
              }
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <p className="text-xs text-rose-500">
              {form.formState.errors.password?.message}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-2xl"
          >
            {isPending ? "Processando..." : isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          {isLogin ? (
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
              Já tenho conta
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/server/actions/auth-actions";

type ForgotPasswordValues = {
  email: string;
};

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);

      if (!result.success) {
        toast.error(result.message ?? "Não foi possível enviar o link.");
        return;
      }

      toast.success(result.message);
      form.reset();
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="forgot-email">E-mail</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="voce@exemplo.com"
          {...form.register("email")}
          className="rounded-2xl"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl"
      >
        {isPending ? "Enviando..." : "Enviar link de redefinição"}
      </Button>
    </form>
  );
}

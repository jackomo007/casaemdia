"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { registerPasswordSchema } from "@/lib/validations/auth";
import { recordPasswordResetCompletedAction } from "@/server/actions/auth-actions";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = registerPasswordSchema.safeParse(password);

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Senha inválida.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (user?.email) {
        await recordPasswordResetCompletedAction({
          email: user.email,
          fullName:
            typeof user.user_metadata.full_name === "string"
              ? user.user_metadata.full_name
              : undefined,
          supabaseUserId: user.id,
        });
      }

      await supabase.auth.signOut();
      toast.success("Senha atualizada com sucesso.");
      router.push("/login?reset=1");
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="reset-password">Nova senha</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl"
          placeholder="Mínimo de 8 caracteres com letra e número"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reset-confirm-password">Confirmar nova senha</Label>
        <Input
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="rounded-2xl"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl"
      >
        {isPending ? "Atualizando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}

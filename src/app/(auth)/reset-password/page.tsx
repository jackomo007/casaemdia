import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <Card className="w-full max-w-xl rounded-[32px] border-white/80 bg-white/95">
        <CardContent className="space-y-5 p-8">
          <h1 className="font-display text-3xl font-semibold text-slate-950">
            Definir nova senha
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            Use uma senha forte para proteger sua família e seus dados.
          </p>
          <ResetPasswordForm />
          <Button asChild variant="outline" className="w-full rounded-2xl">
            <Link href="/login">Voltar ao login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

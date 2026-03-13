import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <Card className="w-full max-w-xl rounded-[32px] border-white/80 bg-white/95">
        <CardContent className="space-y-5 p-8">
          <h1 className="font-display text-3xl font-semibold text-slate-950">
            Recuperacao de senha
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            A base de Supabase Auth esta preparada. Configure as chaves reais
            para enviar o fluxo de reset por e-mail.
          </p>
          <Button asChild className="rounded-2xl">
            <Link href="/login">Voltar ao login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

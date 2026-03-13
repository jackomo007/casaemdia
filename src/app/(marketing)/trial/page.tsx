import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function TrialPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <div className="max-w-3xl rounded-[36px] border border-white/80 bg-white/95 p-8 text-center shadow-[0_36px_100px_-70px_rgba(80,64,153,0.4)]">
        <span className="bg-primary/10 text-primary inline-flex rounded-full px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase">
          Trial 7 dias
        </span>
        <h1 className="font-display mt-6 text-4xl font-semibold text-slate-950">
          Use tudo sem cartao para validar com calma
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Crie sua conta, centralize a operacao da familia e assine apenas se
          fizer sentido. Se o trial expirar, seus dados continuam guardados.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-2xl">
            <Link href="/register">Criar conta agora</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/select-plan">Ver planos</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

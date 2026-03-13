import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <div className="max-w-3xl rounded-[36px] border border-white/80 bg-white/95 p-8 shadow-[0_36px_100px_-70px_rgba(80,64,153,0.4)]">
        <h1 className="font-display text-4xl font-semibold text-slate-950">
          Sua casa ja pode entrar no painel
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          O onboarding completo pode crescer por etapas. Nesta base inicial,
          voce ja consegue navegar no dashboard, testar billing e criar dados.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-2xl">
            <Link href="/dashboard">Ir para o dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/select-plan">Escolher plano</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

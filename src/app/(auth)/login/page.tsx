import { AuthForm } from "@/features/auth/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[36px] border border-white/80 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.18),transparent_45%),linear-gradient(180deg,#fff,#faf7ff)] p-8 text-slate-950 shadow-[0_36px_100px_-70px_rgba(80,64,153,0.4)]">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Painel da Família
          </p>
          <h1 className="font-display mt-6 text-4xl font-semibold">
            Tudo o que move a casa, num painel só.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Entre para ver o dashboard, testar cenários de assinatura e navegar
            por finanças, agenda, filhos, saúde e insights.
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}

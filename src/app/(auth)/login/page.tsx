import { AuthForm } from "@/features/auth/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const shouldShowCheckEmail = params.checkEmail === "1";
  const shouldShowPasswordReset = params.reset === "1";
  const shouldShowConfirmed = params.confirmed === "1";

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
            Entre para acompanhar finanças, agenda, compras e insights em um só
            lugar.
          </p>
          {shouldShowCheckEmail ? (
            <div className="mt-6 rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
              Conta criada. Verifique seu e-mail para confirmar o acesso.
            </div>
          ) : null}
          {shouldShowConfirmed ? (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
              E-mail confirmado. Agora você já pode entrar.
            </div>
          ) : null}
          {shouldShowPasswordReset ? (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
              Senha redefinida com sucesso. Faça login com a nova senha.
            </div>
          ) : null}
        </div>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}

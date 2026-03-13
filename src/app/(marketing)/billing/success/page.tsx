import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function BillingSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <div className="max-w-2xl rounded-[32px] border border-white/80 bg-white/95 p-8 text-center">
        <h1 className="font-display text-4xl font-semibold text-slate-950">
          Pagamento confirmado
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Fluxo mockado aprovado. O acesso foi liberado automaticamente para o
          dashboard.
        </p>
        <Button asChild className="mt-8 rounded-2xl">
          <Link href="/dashboard">Abrir dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

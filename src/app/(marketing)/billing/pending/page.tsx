import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function BillingPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <div className="max-w-2xl rounded-[32px] border border-white/80 bg-white/95 p-8 text-center">
        <h1 className="font-display text-4xl font-semibold text-slate-950">
          Pagamento pendente
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Cenário pronto para tratar boleto, PIX pendente ou reconciliação
          assíncrona via webhook.
        </p>
        <Button asChild className="mt-8 rounded-2xl">
          <Link href="/billing">Voltar ao billing</Link>
        </Button>
      </div>
    </main>
  );
}

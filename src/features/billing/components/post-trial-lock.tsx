import Link from "next/link";

import { LockedFeatureOverlay } from "@/components/billing/locked-feature-overlay";
import { Button } from "@/components/ui/button";

export function PostTrialLock() {
  return (
    <div className="space-y-6">
      <LockedFeatureOverlay
        title="Seu periodo gratis terminou"
        description="Os dados da familia continuam preservados. Escolha um plano para voltar exatamente de onde parou."
      />
      <div className="flex justify-center">
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/billing">Ver portal de assinatura</Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { selectPlanAction } from "@/server/actions/billing-actions";
import type { PlanCode } from "@/types";

export function SelectPlanButton({
  planCode,
  label = "Escolher plano",
}: {
  planCode: PlanCode;
  label?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full rounded-2xl"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await selectPlanAction({ planCode });
          if (!result.success) {
            toast.error(result.message ?? "Não foi possível continuar.");
            return;
          }

          toast.success("Assinatura ativada com sucesso.");
          if (!result.redirectTo) {
            return;
          }
          router.push(result.redirectTo as "/billing/success");
          router.refresh();
        })
      }
    >
      {isPending ? "Ativando..." : label}
    </Button>
  );
}

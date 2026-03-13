"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UpgradeModal() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger render={<Button className="rounded-2xl" />}>
        Ver planos
      </DialogTrigger>
      <DialogContent className="rounded-[28px]">
        <DialogHeader>
          <DialogTitle>Desbloqueie todos os modulos</DialogTitle>
          <DialogDescription>
            Continue com seus dados preservados e sem precisar reconfigurar a
            casa.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="mt-4 rounded-2xl"
          onClick={() => router.push("/select-plan")}
        >
          Escolher plano
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

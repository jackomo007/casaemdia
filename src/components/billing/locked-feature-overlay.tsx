import { LockKeyhole } from "lucide-react";

import { UpgradeModal } from "@/components/billing/upgrade-modal";

export function LockedFeatureOverlay({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-primary/15 rounded-[32px] border bg-white/90 p-8 text-center shadow-[0_26px_80px_-50px_rgba(80,64,153,0.35)]">
      <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-3xl">
        <LockKeyhole className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>
      <div className="mt-6 flex justify-center">
        <UpgradeModal />
      </div>
    </div>
  );
}

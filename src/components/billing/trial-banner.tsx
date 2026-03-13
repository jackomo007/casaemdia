import { Sparkles } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";

export function TrialBanner({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="border-primary/15 rounded-[28px] border bg-[linear-gradient(180deg,#f7f2ff,#ffffff)] p-5 shadow-[0_22px_60px_-42px_rgba(80,64,153,0.35)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-2xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <StatusBadge tone="accent">{label}</StatusBadge>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

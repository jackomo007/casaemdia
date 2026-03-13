import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FilterBar({ labels }: { labels: string[] }) {
  return (
    <div className="border-border/70 bg-card/80 flex flex-wrap items-center gap-3 rounded-3xl border p-3 shadow-[0_12px_30px_-24px_rgba(52,35,122,0.3)]">
      <Button variant="outline" className="rounded-2xl">
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filtros
      </Button>
      {labels.map((label) => (
        <span
          key={label}
          className="border-border bg-muted text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

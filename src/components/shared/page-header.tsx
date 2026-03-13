import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <span className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6 md:text-base">
            {description}
          </p>
        </div>
      </div>
      {actions ? (
        <div className="flex items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

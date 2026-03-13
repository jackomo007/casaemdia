"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-[0_24px_80px_-48px_rgba(80,64,153,0.55)] backdrop-blur lg:flex lg:flex-col">
      <div className="rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(130,103,250,0.18),transparent_60%),linear-gradient(180deg,#fff,#faf7ff)] p-5">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          Painel da Família
        </p>
        <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900">
          Operação familiar em um só lugar
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Agenda, dinheiro e compras com contexto visual.
        </p>
      </div>
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {dashboardNavigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-[0_16px_40px_-26px_rgba(123,97,255,0.8)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-primary/10 bg-primary/5 rounded-[24px] border p-4">
        <p className="text-sm font-semibold text-slate-900">
          7 dias grátis sem cartão
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Convide a família, organize a semana e ative um plano quando fizer
          sentido.
        </p>
      </div>
    </aside>
  );
}

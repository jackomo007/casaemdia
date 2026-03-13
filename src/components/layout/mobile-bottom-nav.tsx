"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mobileBottomNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-[26px] border border-white/80 bg-white/95 p-2 shadow-[0_18px_50px_-32px_rgba(80,64,153,0.45)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileBottomNavigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-500",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import type { ReactNode } from "react";

import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  children,
  topbarTitle,
}: {
  children: ReactNode;
  topbarTitle: string;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf7ff_0%,#f5f7fb_50%,#f6f6fb_100%)] px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col gap-4 pb-24 lg:pb-8">
          <Topbar title={topbarTitle} />
          <main className="flex-1 space-y-6">{children}</main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

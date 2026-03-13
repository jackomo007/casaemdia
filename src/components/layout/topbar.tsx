import { Bell } from "lucide-react";

import { DashboardSearchForm } from "@/components/layout/dashboard-search-form";
import { Button } from "@/components/ui/button";
import { getSessionContext } from "@/lib/auth/session";
import { signOutAction } from "@/server/actions/auth-actions";

export async function Topbar({ title }: { title: string }) {
  const session = await getSessionContext();
  const firstName = session.user?.fullName.split(" ")[0] ?? "Sua";

  return (
    <header className="sticky top-4 z-40 rounded-[28px] border border-white/80 bg-white/90 px-4 py-4 shadow-[0_18px_60px_-36px_rgba(80,64,153,0.4)] backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Casa de {firstName}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <DashboardSearchForm />
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Bell className="h-4 w-4" />
          </Button>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="rounded-2xl">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

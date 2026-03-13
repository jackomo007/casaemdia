import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <div className="relative hidden w-72 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar eventos, contas e tarefas..."
              className="rounded-2xl border-white bg-slate-50 pl-10 shadow-none"
            />
          </div>
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

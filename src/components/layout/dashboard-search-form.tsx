"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

export function DashboardSearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      if (pathname.startsWith("/dashboard/busca")) {
        router.push("/dashboard");
      }
      return;
    }

    router.push(`/dashboard/busca?q=${encodeURIComponent(normalizedQuery)}`);
  }

  return (
    <form className="relative hidden w-72 md:block" onSubmit={handleSubmit}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar agenda, financas e compras..."
        className="rounded-2xl border-white bg-slate-50 pl-10 shadow-none"
        aria-label="Buscar no painel"
      />
    </form>
  );
}

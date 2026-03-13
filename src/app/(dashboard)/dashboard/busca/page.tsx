import Link from "next/link";
import type { Route } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { searchWorkspace } from "@/server/services/search-service";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const queryParam = params.q;
  const query = Array.isArray(queryParam)
    ? (queryParam[0] ?? "")
    : (queryParam ?? "");
  const results = await searchWorkspace(query);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Busca"
        title={query ? `Resultados para "${query}"` : "Busque no painel"}
        description="Procure compromissos, lancamentos, listas de compra e insights a partir do topo do app."
      />

      {!query ? (
        <EmptyState
          title="Digite algo para buscar"
          description="Use a busca do topo para localizar itens da agenda, finanças, compras e insights."
        />
      ) : results.length ? (
        results.map((group) => (
          <section key={group.title} className="space-y-4">
            <SectionHeader
              title={group.title}
              description={`${group.items.length} resultado(s) encontrado(s).`}
            />
            <div className="grid gap-4">
              {group.items.map((item) => (
                <Link key={item.id} href={item.href as Route}>
                  <Card className="border-border/70 rounded-[28px] bg-white/90 transition-colors hover:bg-white">
                    <CardContent className="space-y-2 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold text-slate-950">
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                          {item.meta}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      ) : (
        <EmptyState
          title="Nenhum resultado encontrado"
          description="Tente outro termo ou ajuste a escrita para localizar o item desejado."
        />
      )}
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { InsightCard } from "@/components/shared/insight-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { InsightCardData } from "@/types";

async function fetchInsights(): Promise<InsightCardData[]> {
  const response = await fetch("/api/insights");
  const data = (await response.json()) as { insights: InsightCardData[] };
  return data.insights;
}

export function LiveInsightsPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: fetchInsights,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        Carregando insights...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="Sem insights no momento"
        description="Preencha mais dados para destravar analises educacionais e operacionais."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

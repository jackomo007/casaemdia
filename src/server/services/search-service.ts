import "server-only";

import { getWorkspaceSession } from "@/lib/auth/session";
import { getWorkspaceSnapshot } from "@/server/repositories/demo-store";
import { buildAgendaItems } from "@/server/services/calendar-service";

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  meta: string;
};

export type SearchResultGroup = {
  title: string;
  items: SearchResultItem[];
};

function includesQuery(query: string, ...values: Array<string | undefined>) {
  return values.some((value) => value?.toLowerCase().includes(query));
}

export async function searchWorkspace(rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return [] as SearchResultGroup[];
  }

  const session = await getWorkspaceSession();
  const workspace = getWorkspaceSnapshot(session);

  const agenda = buildAgendaItems(workspace)
    .filter((item) =>
      includesQuery(query, item.title, item.description, item.kind),
    )
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: "/dashboard/agenda",
      meta: "Agenda",
    }));

  const finances = workspace.finance.entries
    .filter((entry) =>
      includesQuery(
        query,
        entry.title,
        entry.category,
        entry.account,
        entry.member,
        entry.status,
      ),
    )
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: `${entry.category} • ${entry.account}`,
      href: "/dashboard/financas",
      meta: "Financas",
    }));

  const shopping = workspace.shoppingLists
    .filter((list) =>
      includesQuery(
        query,
        list.title,
        list.category,
        ...list.items.map((item) => item.name),
      ),
    )
    .map((list) => ({
      id: list.id,
      title: list.title,
      description: list.category,
      href: "/dashboard/compras",
      meta: "Compras",
    }));

  const insights = workspace.insights
    .filter((insight) =>
      includesQuery(query, insight.title, insight.content, insight.tone),
    )
    .map((insight) => ({
      id: insight.id,
      title: insight.title,
      description: insight.content,
      href: "/dashboard/insights",
      meta: "Insights",
    }));

  return [
    { title: "Agenda", items: agenda },
    { title: "Financas", items: finances },
    { title: "Compras", items: shopping },
    { title: "Insights", items: insights },
  ].filter((group) => group.items.length);
}

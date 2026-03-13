import "server-only";

import { getSessionContext } from "@/lib/auth/session";

export async function getUserSettings() {
  const session = await getSessionContext();

  return {
    locale: "pt-BR",
    timezone: "America/Sao_Paulo",
    notificationsEnabled: true,
    aiInsightsEnabled: true,
    user: session.user,
  };
}

import type { AccessState, BillingStatus } from "@/types";

const blockedStatuses: BillingStatus[] = ["EXPIRED", "CANCELED", "INCOMPLETE"];

export function canAccessPrivateApp(access: AccessState): boolean {
  return access.hasAccess && !blockedStatuses.includes(access.status);
}

export function shouldShowUpgrade(access: AccessState): boolean {
  return !access.hasAccess || blockedStatuses.includes(access.status);
}

export function getBlockedMessage(status: BillingStatus): string {
  switch (status) {
    case "PAST_DUE":
      return "Existe uma cobranca pendente. Atualize o plano para retomar todos os modulos.";
    case "EXPIRED":
      return "Seu trial terminou. Seus dados continuam preservados, mas o painel foi bloqueado ate a assinatura.";
    case "CANCELED":
      return "A assinatura foi cancelada. Escolha um plano para liberar novamente o dashboard.";
    default:
      return "Finalize a ativacao do plano para continuar usando o painel.";
  }
}

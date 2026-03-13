import type { AccessState, BillingStatus } from "@/types";

const blockedStatuses: BillingStatus[] = [
  "EXPIRED",
  "CANCELED",
  "INCOMPLETE",
  "PAST_DUE",
];

export function canAccessPrivateApp(access: AccessState): boolean {
  return access.hasAccess && !blockedStatuses.includes(access.status);
}

export function shouldShowUpgrade(access: AccessState): boolean {
  return !access.hasAccess || blockedStatuses.includes(access.status);
}

export function getBlockedMessage(status: BillingStatus): string {
  switch (status) {
    case "PAST_DUE":
      return "Existe uma cobrança pendente. Regularize a assinatura para voltar a entrar no painel.";
    case "EXPIRED":
      return "Seu trial terminou. Seus dados continuam preservados, mas o painel foi bloqueado até a assinatura.";
    case "CANCELED":
      return "A assinatura foi cancelada. Escolha um plano para liberar novamente o dashboard.";
    default:
      return "Finalize a ativação do plano para continuar usando o painel.";
  }
}

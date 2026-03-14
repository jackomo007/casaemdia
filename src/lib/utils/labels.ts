import type { BillingStatus, PriorityLevel } from "@/types";

const billingStatusLabels: Record<BillingStatus, string> = {
  TRIALING: "Em teste",
  ACTIVE: "Ativo",
  PAST_DUE: "Pagamento pendente",
  CANCELED: "Cancelado",
  EXPIRED: "Expirado",
  INCOMPLETE: "Incompleto",
};

const priorityLabels: Record<PriorityLevel, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export function getBillingStatusLabel(status: BillingStatus) {
  return billingStatusLabels[status];
}

export function getPriorityLabel(priority: PriorityLevel | string) {
  const normalizedPriority = priority.trim().toLowerCase() as PriorityLevel;

  return priorityLabels[normalizedPriority] ?? priority;
}

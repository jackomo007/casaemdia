import { format, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

import { createLocalDate } from "@/lib/utils/date";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatShortDate(value: string): string {
  return format(createLocalDate(value), "dd MMM", { locale: ptBR });
}

export function formatLongDate(value: string): string {
  return format(createLocalDate(value), "dd 'de' MMMM", { locale: ptBR });
}

export function formatDateTime(value: string): string {
  return format(createLocalDate(value), "dd MMM, HH:mm", { locale: ptBR });
}

export function formatRelative(value: string): string {
  return formatDistanceToNowStrict(createLocalDate(value), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

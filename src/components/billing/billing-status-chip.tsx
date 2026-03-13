import type { BillingStatus } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";

const toneByStatus: Record<
  BillingStatus,
  "neutral" | "success" | "warning" | "danger" | "accent"
> = {
  TRIALING: "accent",
  ACTIVE: "success",
  PAST_DUE: "warning",
  CANCELED: "danger",
  EXPIRED: "danger",
  INCOMPLETE: "warning",
};

export function BillingStatusChip({ status }: { status: BillingStatus }) {
  return <StatusBadge tone={toneByStatus[status]}>{status}</StatusBadge>;
}

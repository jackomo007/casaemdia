"use client";

import { AlertTriangle, CheckCircle2, Clock3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatLongDate } from "@/lib/utils/formatters";
import {
  deleteFinanceEntryAction,
  updateFinanceEntryStatusAction,
} from "@/server/actions/finance-actions";
import type { FinanceEntry, FinancialStatus } from "@/types";

const statusLabel: Record<FinancialStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Atrasado",
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function inferExpenseSection(entry: FinanceEntry) {
  const normalizedCategory = normalizeText(entry.category);
  const normalizedAccount = normalizeText(entry.account);

  if (
    normalizedCategory.includes("negoci") ||
    normalizedCategory.includes("cartao") ||
    normalizedCategory.includes("emprest") ||
    normalizedCategory.includes("parcel") ||
    normalizedCategory.includes("imposto") ||
    normalizedCategory.includes("atraso") ||
    normalizedCategory.includes("limite") ||
    normalizedAccount.includes("renegoci")
  ) {
    return "negotiable" as const;
  }

  return "fixed" as const;
}

export function FinanceEntriesTable({
  entries,
  monthLabel,
}: {
  entries: FinanceEntry[];
  monthLabel: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, FinancialStatus>
  >({});

  function handleStatusChange(id: string, status: FinancialStatus) {
    const previousStatus =
      statusOverrides[id] ?? entries.find((entry) => entry.id === id)?.status;
    setStatusOverrides((current) => ({
      ...current,
      [id]: status,
    }));

    startTransition(async () => {
      const result = await updateFinanceEntryStatusAction({ id, status });

      if (!result.success) {
        setStatusOverrides((current) => ({
          ...current,
          ...(previousStatus ? { [id]: previousStatus } : {}),
        }));
        toast.error("Nao foi possivel atualizar o status.");
        return;
      }

      toast.success("Status atualizado.");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteFinanceEntryAction({ id });

      if (!result.success) {
        toast.error("Nao foi possivel apagar o lancamento.");
        return;
      }

      toast.success("Lançamento apagado.");
      router.refresh();
    });
  }

  const expenseEntries = entries
    .filter((entry) => entry.kind === "expense")
    .map((entry) => ({
      ...entry,
      currentStatus: statusOverrides[entry.id] ?? entry.status,
      section: inferExpenseSection(entry),
    }));

  const paidTotal = expenseEntries
    .filter((entry) => entry.currentStatus === "paid")
    .reduce((total, entry) => total + entry.amount, 0);
  const pendingTotal = expenseEntries
    .filter((entry) => entry.currentStatus !== "paid")
    .reduce((total, entry) => total + entry.amount, 0);
  const essentialPending = expenseEntries
    .filter(
      (entry) => entry.currentStatus !== "paid" && entry.section === "fixed",
    )
    .reduce((total, entry) => total + entry.amount, 0);
  const negotiablePending = expenseEntries
    .filter(
      (entry) =>
        entry.currentStatus !== "paid" && entry.section === "negotiable",
    )
    .reduce((total, entry) => total + entry.amount, 0);

  const reminderTone =
    essentialPending > 0
      ? {
          wrapper:
            "border-rose-200 bg-[linear-gradient(180deg,#fff7f7,#fff0f0)]",
          iconWrapper: "bg-rose-100 text-rose-600",
          title: "Nao esquece dos essenciais",
          body:
            negotiablePending > 0
              ? `Ainda faltam ${formatCurrency(essentialPending)} em contas essenciais e ${formatCurrency(negotiablePending)} em gastos negociáveis. Priorize o essencial primeiro.`
              : `Ainda faltam ${formatCurrency(essentialPending)} em contas essenciais. Priorize esse pagamento para a casa nao travar.`,
          icon: AlertTriangle,
        }
      : negotiablePending > 0
        ? {
            wrapper:
              "border-amber-200 bg-[linear-gradient(180deg,#fffdf7,#fff8eb)]",
            iconWrapper: "bg-amber-100 text-amber-600",
            title: "Pendencias renegociaveis",
            body: `Ainda faltam ${formatCurrency(negotiablePending)} em gastos negociáveis. Se apertar, lembra de renegociar antes de virar outra bola de neve.`,
            icon: Clock3,
          }
        : {
            wrapper:
              "border-emerald-200 bg-[linear-gradient(180deg,#f7fffb,#effcf5)]",
            iconWrapper: "bg-emerald-100 text-emerald-600",
            title: "Mes em dia",
            body: "As despesas deste mês estão marcadas como pagas na planilha.",
            icon: CheckCircle2,
          };
  const ReminderIcon = reminderTone.icon;

  return (
    <div className="border-border/70 overflow-hidden rounded-[28px] border bg-white/90 shadow-[0_20px_56px_-44px_rgba(80,64,153,0.3)]">
      <div className="border-b border-slate-200 px-5 py-4 text-sm text-slate-500">
        Mostrando lançamentos de {monthLabel}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Lançamento
            </TableHead>
            <TableHead className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Vencimento
            </TableHead>
            <TableHead className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Valor
            </TableHead>
            <TableHead className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Conta
            </TableHead>
            <TableHead className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Status
            </TableHead>
            <TableHead className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const currentStatus = statusOverrides[entry.id] ?? entry.status;

            return (
              <TableRow key={entry.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{entry.title}</p>
                    <p className="text-xs text-slate-400">{entry.category}</p>
                  </div>
                </TableCell>
                <TableCell>{formatLongDate(entry.dueDate)}</TableCell>
                <TableCell>
                  <span
                    className={
                      entry.kind === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    {entry.kind === "income" ? "+" : "-"}{" "}
                    {formatCurrency(entry.amount)}
                  </span>
                </TableCell>
                <TableCell>{entry.account}</TableCell>
                <TableCell>
                  <Select
                    value={currentStatus}
                    disabled={isPending}
                    onValueChange={(value) =>
                      handleStatusChange(entry.id, value as FinancialStatus)
                    }
                  >
                    <SelectTrigger className="w-36 rounded-2xl bg-white">
                      <SelectValue>{statusLabel[currentStatus]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabel).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isPending}
                    aria-label={`Apagar ${entry.title}`}
                    className="rounded-2xl"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="border-t border-slate-200 bg-slate-50/70 p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-4">
              <p className="text-sm text-slate-500">Total pendente</p>
              <p className="mt-2 text-lg font-semibold text-rose-600">
                {formatCurrency(pendingTotal)}
              </p>
            </div>
            <div className="rounded-3xl bg-white p-4">
              <p className="text-sm text-slate-500">Total pago</p>
              <p className="mt-2 text-lg font-semibold text-emerald-600">
                {formatCurrency(paidTotal)}
              </p>
            </div>
          </div>
          <div
            className={`rounded-3xl border px-4 py-4 ${reminderTone.wrapper}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${reminderTone.iconWrapper}`}
              >
                <ReminderIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-950">
                  {reminderTone.title}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {reminderTone.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

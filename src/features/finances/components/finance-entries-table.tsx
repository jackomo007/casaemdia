"use client";

import { Trash2 } from "lucide-react";
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
      router.refresh();
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
    </div>
  );
}

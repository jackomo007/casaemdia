"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

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
import { updateFinanceEntryStatusAction } from "@/server/actions/finance-actions";
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

  function handleStatusChange(id: string, status: FinancialStatus) {
    startTransition(async () => {
      const result = await updateFinanceEntryStatusAction({ id, status });

      if (!result.success) {
        toast.error("Nao foi possivel atualizar o status.");
        return;
      }

      toast.success("Status atualizado.");
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
              Membro
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-slate-950">{entry.title}</p>
                  <p className="text-xs text-slate-400">{entry.category}</p>
                </div>
              </TableCell>
              <TableCell>{entry.member}</TableCell>
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
                  value={entry.status}
                  disabled={isPending}
                  onValueChange={(value) =>
                    handleStatusChange(entry.id, value as FinancialStatus)
                  }
                >
                  <SelectTrigger className="w-36 rounded-2xl bg-white">
                    <SelectValue />
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

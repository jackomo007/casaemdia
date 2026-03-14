"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonthDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/formatters";
import { syncFinanceMonthPlanAction } from "@/server/actions/finance-actions";
import type { FinanceEntry, FinancialStatus } from "@/types";

type PlanningSection = "income" | "fixed" | "negotiable";

type PlanningRow = {
  id?: string;
  clientId: string;
  title: string;
  amount: string;
  dueDate: string;
  account: string;
  status: FinancialStatus;
  section: PlanningSection;
  category: string;
  member: string;
  paymentDate?: string;
};

const statusLabel: Record<FinancialStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Atrasado",
};

const SECTION_ORDER: PlanningSection[] = ["income", "fixed", "negotiable"];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function createClientId(section: PlanningSection) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${section}-${crypto.randomUUID()}`;
  }

  return `${section}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseAmount(value: string) {
  const raw = value.trim();

  if (!raw) {
    return 0;
  }

  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getSectionMeta(section: PlanningSection) {
  if (section === "income") {
    return {
      title: "Entradas do mês",
      tone: "bg-[#39A74E]",
      text: "text-slate-950",
      emptyLabel: "Sem entradas neste mês ainda.",
    };
  }

  if (section === "fixed") {
    return {
      title: "Custos que não podem travar",
      tone: "bg-[#6FA4D7]",
      text: "text-slate-950",
      emptyLabel: "Sem custos essenciais neste mês.",
    };
  }

  return {
    title: "Gastos negociáveis",
    tone: "bg-[#C782A7]",
    text: "text-slate-950",
    emptyLabel: "Sem gastos negociáveis neste mês.",
  };
}

function inferExpenseSection(
  entry: FinanceEntry,
): Exclude<PlanningSection, "income"> {
  if (typeof entry.isFixed === "boolean") {
    return entry.isFixed ? "fixed" : "negotiable";
  }

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
    return "negotiable";
  }

  return "fixed";
}

function getDefaultCategory(section: PlanningSection) {
  if (section === "income") {
    return "Receita";
  }

  return section === "fixed" ? "Essencial" : "Negociável";
}

function getDefaultMember(section: PlanningSection) {
  return section === "income" ? "Responsável" : "Casa";
}

function getDefaultAccount(section: PlanningSection, title: string) {
  if (section === "income") {
    return normalizeText(title).includes("pj") ? "Conta PJ" : "Conta principal";
  }

  return section === "fixed" ? "Planejamento essencial" : "Renegociação";
}

function createPlanningRow(
  section: PlanningSection,
  selectedMonth: string,
  overrides?: Partial<PlanningRow>,
): PlanningRow {
  const fallbackTitle =
    section === "income"
      ? "Nova entrada"
      : section === "fixed"
        ? "Nova conta essencial"
        : "Novo gasto negociável";
  const title = overrides?.title ?? fallbackTitle;

  return {
    id: overrides?.id,
    clientId: overrides?.clientId ?? createClientId(section),
    title,
    amount: overrides?.amount ?? "0,00",
    dueDate:
      overrides?.dueDate ??
      getMonthDate(
        selectedMonth,
        section === "income" ? 5 : section === "fixed" ? 10 : 15,
      ),
    account: overrides?.account ?? getDefaultAccount(section, title),
    status: overrides?.status ?? "pending",
    section,
    category: overrides?.category ?? getDefaultCategory(section),
    member: overrides?.member ?? getDefaultMember(section),
    paymentDate: overrides?.paymentDate,
  };
}

function createInitialTemplate(selectedMonth: string) {
  return [
    createPlanningRow("income", selectedMonth, {
      title: "CLT",
      dueDate: getMonthDate(selectedMonth, 5),
    }),
    createPlanningRow("income", selectedMonth, {
      title: "Auxílio Home Office",
      dueDate: getMonthDate(selectedMonth, 10),
    }),
    createPlanningRow("income", selectedMonth, {
      title: "PJ",
      account: "Conta PJ",
      dueDate: getMonthDate(selectedMonth, 15),
    }),
    createPlanningRow("fixed", selectedMonth, {
      title: "Aluguel",
      dueDate: getMonthDate(selectedMonth, 10),
    }),
    createPlanningRow("fixed", selectedMonth, {
      title: "Água",
      dueDate: getMonthDate(selectedMonth, 12),
    }),
    createPlanningRow("fixed", selectedMonth, {
      title: "Plano telefones",
      dueDate: getMonthDate(selectedMonth, 15),
    }),
    createPlanningRow("negotiable", selectedMonth, {
      title: "Cartão de crédito",
      dueDate: getMonthDate(selectedMonth, 15),
    }),
    createPlanningRow("negotiable", selectedMonth, {
      title: "Empréstimo",
      dueDate: getMonthDate(selectedMonth, 20),
    }),
    createPlanningRow("negotiable", selectedMonth, {
      title: "Parcelamento / carnê",
      dueDate: getMonthDate(selectedMonth, 22),
    }),
  ];
}

function mapEntriesToRows(entries: FinanceEntry[]) {
  return [...entries]
    .sort((left, right) => {
      const leftSection =
        left.kind === "income" ? "income" : inferExpenseSection(left);
      const rightSection =
        right.kind === "income" ? "income" : inferExpenseSection(right);
      const sectionDiff =
        SECTION_ORDER.indexOf(leftSection) -
        SECTION_ORDER.indexOf(rightSection);

      if (sectionDiff !== 0) {
        return sectionDiff;
      }

      return left.dueDate.localeCompare(right.dueDate);
    })
    .map((entry) =>
      createPlanningRow(
        entry.kind === "income" ? "income" : inferExpenseSection(entry),
        entry.competenceDate.slice(0, 7),
        {
          id: entry.id,
          clientId: entry.id,
          title: entry.title,
          amount: String(entry.amount).replace(".", ","),
          dueDate: entry.dueDate,
          account: entry.account,
          status: entry.status,
          category: entry.category,
          member: entry.member,
          paymentDate: entry.paymentDate,
        },
      ),
    );
}

function buildRows(
  selectedMonth: string,
  currentEntries: FinanceEntry[],
  hasAnyEntries: boolean,
) {
  if (currentEntries.length) {
    return mapEntriesToRows(currentEntries);
  }

  if (!hasAnyEntries) {
    return createInitialTemplate(selectedMonth);
  }

  return [];
}

function cloneRows(rows: PlanningRow[]) {
  return rows.map((row) => ({ ...row }));
}

function serializeRows(rows: PlanningRow[]) {
  return JSON.stringify(
    rows.map((row) => ({
      id: row.id ?? null,
      title: row.title,
      amount: row.amount,
      dueDate: row.dueDate,
      account: row.account,
      status: row.status,
      section: row.section,
      category: row.category,
      member: row.member,
      paymentDate: row.paymentDate ?? null,
    })),
  );
}

function getReminder(rows: PlanningRow[]) {
  const expenseRows = rows.filter((row) => row.section !== "income");
  const paidTotal = expenseRows
    .filter((row) => row.status === "paid")
    .reduce((total, row) => total + parseAmount(row.amount), 0);
  const pendingTotal = expenseRows
    .filter((row) => row.status !== "paid")
    .reduce((total, row) => total + parseAmount(row.amount), 0);
  const essentialPending = expenseRows
    .filter((row) => row.status !== "paid" && row.section === "fixed")
    .reduce((total, row) => total + parseAmount(row.amount), 0);
  const negotiablePending = expenseRows
    .filter((row) => row.status !== "paid" && row.section === "negotiable")
    .reduce((total, row) => total + parseAmount(row.amount), 0);

  const reminderTone =
    essentialPending > 0
      ? {
          wrapper:
            "border-rose-200 bg-[linear-gradient(180deg,#fff7f7,#fff0f0)]",
          iconWrapper: "bg-rose-100 text-rose-600",
          title: "Não esquece dos essenciais",
          body:
            negotiablePending > 0
              ? `Ainda faltam ${formatCurrency(essentialPending)} em contas essenciais e ${formatCurrency(negotiablePending)} em gastos negociáveis. Priorize o essencial primeiro.`
              : `Ainda faltam ${formatCurrency(essentialPending)} em contas essenciais. Priorize esse pagamento para a casa não travar.`,
          icon: AlertTriangle,
        }
      : negotiablePending > 0
        ? {
            wrapper:
              "border-amber-200 bg-[linear-gradient(180deg,#fffdf7,#fff8eb)]",
            iconWrapper: "bg-amber-100 text-amber-600",
            title: "Pendências renegociáveis",
            body: `Ainda faltam ${formatCurrency(negotiablePending)} em gastos negociáveis. Se apertar, renegocie antes de virar outra bola de neve.`,
            icon: Clock3,
          }
        : {
            wrapper:
              "border-emerald-200 bg-[linear-gradient(180deg,#f7fffb,#effcf5)]",
            iconWrapper: "bg-emerald-100 text-emerald-600",
            title: "Mês em dia",
            body: "As despesas deste mês estão marcadas como pagas na planilha.",
            icon: CheckCircle2,
          };

  return {
    paidTotal,
    pendingTotal,
    reminderTone,
  };
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function FinancePlanningSheet({
  selectedMonth,
  currentEntries,
  hasAnyEntries,
}: {
  selectedMonth: string;
  currentEntries: FinanceEntry[];
  hasAnyEntries: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState(() =>
    buildRows(selectedMonth, currentEntries, hasAnyEntries),
  );
  const [savedRows, setSavedRows] = useState(() =>
    cloneRows(buildRows(selectedMonth, currentEntries, hasAnyEntries)),
  );

  const hasUnsavedChanges = serializeRows(rows) !== serializeRows(savedRows);
  const monthLabel = formatMonthLabel(selectedMonth);
  const reminder = getReminder(rows);
  const ReminderIcon = reminder.reminderTone.icon;

  function updateRow(
    clientId: string,
    key: keyof Pick<
      PlanningRow,
      "title" | "amount" | "dueDate" | "account" | "status"
    >,
    value: string,
  ) {
    setRows((current) =>
      current.map((row) =>
        row.clientId === clientId
          ? {
              ...row,
              [key]: value,
              paymentDate:
                key === "status"
                  ? value === "paid"
                    ? (row.paymentDate ?? new Date().toISOString())
                    : undefined
                  : row.paymentDate,
            }
          : row,
      ),
    );
  }

  function addRow(section: PlanningSection) {
    setRows((current) => [
      ...current,
      createPlanningRow(section, selectedMonth),
    ]);
  }

  function removeRow(clientId: string) {
    setRows((current) => current.filter((row) => row.clientId !== clientId));
  }

  function resetRows() {
    setRows(cloneRows(savedRows));
  }

  function getRowsBySection(section: PlanningSection) {
    return rows.filter((row) => row.section === section);
  }

  function handleSave() {
    const rowsToPersist = rows
      .filter((row) => parseAmount(row.amount) > 0)
      .map((row) => ({
        id: row.id,
        title: row.title.trim(),
        amount: parseAmount(row.amount),
        dueDate: row.dueDate,
        account: row.account.trim(),
        status: row.status,
        section: row.section,
        category: row.category.trim() || getDefaultCategory(row.section),
        member: row.member.trim() || getDefaultMember(row.section),
        paymentDate: row.status === "paid" ? row.paymentDate : undefined,
      }));

    if (!rowsToPersist.length && !hasAnyEntries) {
      toast.error("Preencha ao menos uma linha com valor maior que zero.");
      return;
    }

    if (
      rowsToPersist.some(
        (row) => row.title.length < 2 || row.account.length < 2 || !row.dueDate,
      )
    ) {
      toast.error("Revise as linhas preenchidas antes de salvar.");
      return;
    }

    startTransition(async () => {
      const result = await syncFinanceMonthPlanAction({
        monthKey: selectedMonth,
        rows: rowsToPersist,
      });

      if (!result.success) {
        toast.error("Não foi possível salvar a planilha deste mês.");
        return;
      }

      setSavedRows(cloneRows(rows));
      toast.success(
        hasAnyEntries
          ? "Planilha do mês atualizada."
          : "Base inicial salva e copiada para os outros meses do ano.",
      );
      router.refresh();
    });
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Visão planilha"
        description="Edite a própria tabela por linha. Entradas vêm primeiro, depois o que não pode travar e por fim o que pode ser negociado."
        action={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending || !hasUnsavedChanges}
              className="rounded-2xl"
              onClick={resetRows}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Desfazer alterações
            </Button>
            <Button
              type="button"
              disabled={isPending || !hasUnsavedChanges}
              className="rounded-2xl"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending
                ? "Salvando..."
                : hasAnyEntries
                  ? "Salvar alterações do mês"
                  : "Salvar base e copiar para os meses"}
            </Button>
          </div>
        }
      />

      {!hasAnyEntries ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          No primeiro preenchimento salvo em {monthLabel}, a mesma base será
          copiada para todos os meses de {selectedMonth.slice(0, 4)}. Depois
          disso cada mês passa a ser editado manualmente.
        </div>
      ) : null}

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
            {SECTION_ORDER.map((section) => {
              const sectionMeta = getSectionMeta(section);
              const sectionRows = getRowsBySection(section);

              return (
                <Fragment key={section}>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={6}
                      className={`${sectionMeta.tone} ${sectionMeta.text} px-5 py-3 text-[2rem] leading-none font-semibold tracking-tight`}
                    >
                      {sectionMeta.title}
                    </TableCell>
                  </TableRow>

                  {sectionRows.length ? (
                    sectionRows.map((row) => (
                      <TableRow key={row.clientId}>
                        <TableCell className="min-w-64">
                          <div className="space-y-1">
                            <Input
                              value={row.title}
                              onChange={(event) =>
                                updateRow(
                                  row.clientId,
                                  "title",
                                  event.target.value,
                                )
                              }
                              className="border-transparent bg-transparent px-0 text-base font-medium text-slate-950 shadow-none focus-visible:ring-0"
                            />
                            <p className="text-xs text-slate-400">
                              {row.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-40">
                          <Input
                            type="date"
                            value={row.dueDate}
                            onChange={(event) =>
                              updateRow(
                                row.clientId,
                                "dueDate",
                                event.target.value,
                              )
                            }
                            className="rounded-2xl bg-white"
                          />
                        </TableCell>
                        <TableCell className="min-w-40">
                          <Input
                            inputMode="decimal"
                            value={row.amount}
                            onChange={(event) =>
                              updateRow(
                                row.clientId,
                                "amount",
                                event.target.value,
                              )
                            }
                            className="rounded-2xl bg-white"
                            placeholder="0,00"
                          />
                        </TableCell>
                        <TableCell className="min-w-52">
                          <Input
                            value={row.account}
                            onChange={(event) =>
                              updateRow(
                                row.clientId,
                                "account",
                                event.target.value,
                              )
                            }
                            className="rounded-2xl bg-white"
                          />
                        </TableCell>
                        <TableCell className="min-w-44">
                          <Select
                            value={row.status}
                            onValueChange={(value) =>
                              updateRow(
                                row.clientId,
                                "status",
                                value as FinancialStatus,
                              )
                            }
                          >
                            <SelectTrigger className="w-40 rounded-2xl bg-white">
                              <SelectValue>
                                {statusLabel[row.status]}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabel).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="min-w-24">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-2xl"
                            onClick={() => removeRow(row.clientId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-5 py-4 text-sm text-slate-500"
                      >
                        {sectionMeta.emptyLabel}
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="px-5 py-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto rounded-2xl px-0 text-lg font-medium text-slate-700 hover:bg-transparent hover:text-slate-950"
                        onClick={() => addRow(section)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar mais
                      </Button>
                    </TableCell>
                  </TableRow>
                </Fragment>
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
                  {formatCurrency(reminder.pendingTotal)}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm text-slate-500">Total pago</p>
                <p className="mt-2 text-lg font-semibold text-emerald-600">
                  {formatCurrency(reminder.paidTotal)}
                </p>
              </div>
            </div>
            <div
              className={`rounded-3xl border px-4 py-4 ${reminder.reminderTone.wrapper}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${reminder.reminderTone.iconWrapper}`}
                >
                  <ReminderIcon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-950">
                    {reminder.reminderTone.title}
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    {reminder.reminderTone.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {rows.length ? null : (
        <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          Este mês está vazio. Use os botões de adicionar para montar sua
          planilha.
        </div>
      )}
    </section>
  );
}

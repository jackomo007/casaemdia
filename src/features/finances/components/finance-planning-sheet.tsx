"use client";

import { CircleDollarSign, HandCoins, House, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/formatters";
import { createFinanceSheetEntriesAction } from "@/server/actions/finance-actions";

type PlanningSection = "fixed" | "negotiable" | "income";
type IncomeType = "CLT" | "PJ" | "Extra";

type PlanningRow = {
  id: string;
  label: string;
  amount: string;
  dueDate: string;
  section: PlanningSection;
  incomeType?: IncomeType;
};

function getMonthStart() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

function getMonthDate(day: number) {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const fixedRowsTemplate: PlanningRow[] = [
  {
    id: "fixed-rent",
    label: "Aluguel",
    amount: "",
    dueDate: getMonthDate(10),
    section: "fixed",
  },
  {
    id: "fixed-water",
    label: "Água",
    amount: "",
    dueDate: getMonthDate(12),
    section: "fixed",
  },
  {
    id: "fixed-phone",
    label: "Plano de telefones",
    amount: "",
    dueDate: getMonthDate(15),
    section: "fixed",
  },
  {
    id: "fixed-energy",
    label: "Energia",
    amount: "",
    dueDate: getMonthDate(18),
    section: "fixed",
  },
  {
    id: "fixed-internet",
    label: "Internet",
    amount: "",
    dueDate: getMonthDate(20),
    section: "fixed",
  },
  {
    id: "fixed-essential",
    label: "Outro essencial",
    amount: "",
    dueDate: getMonthDate(25),
    section: "fixed",
  },
];

const negotiableRowsTemplate: PlanningRow[] = [
  {
    id: "neg-credit-card",
    label: "Cartão de crédito",
    amount: "",
    dueDate: getMonthDate(15),
    section: "negotiable",
  },
  {
    id: "neg-loan",
    label: "Empréstimo",
    amount: "",
    dueDate: getMonthDate(20),
    section: "negotiable",
  },
  {
    id: "neg-installment",
    label: "Parcelamento / carne",
    amount: "",
    dueDate: getMonthDate(22),
    section: "negotiable",
  },
  {
    id: "neg-tax",
    label: "Imposto / atraso",
    amount: "",
    dueDate: getMonthDate(25),
    section: "negotiable",
  },
  {
    id: "neg-limit",
    label: "Cheque especial / limite",
    amount: "",
    dueDate: getMonthDate(28),
    section: "negotiable",
  },
  {
    id: "neg-other",
    label: "Outra dívida negociável",
    amount: "",
    dueDate: getMonthDate(30),
    section: "negotiable",
  },
];

const incomeRowsTemplate: PlanningRow[] = [
  {
    id: "income-clt-main",
    label: "Renda principal",
    amount: "",
    dueDate: getMonthDate(5),
    section: "income",
    incomeType: "CLT",
  },
  {
    id: "income-clt-extra",
    label: "Benefício / auxílio",
    amount: "",
    dueDate: getMonthDate(7),
    section: "income",
    incomeType: "CLT",
  },
  {
    id: "income-pj",
    label: "Projeto PJ",
    amount: "",
    dueDate: getMonthDate(15),
    section: "income",
    incomeType: "PJ",
  },
  {
    id: "income-extra",
    label: "Renda extra",
    amount: "",
    dueDate: getMonthDate(20),
    section: "income",
    incomeType: "Extra",
  },
];

function parseAmount(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRowTotal(rows: PlanningRow[]) {
  return rows.reduce((total, row) => total + parseAmount(row.amount), 0);
}

function buildEntries(rows: PlanningRow[]) {
  const competenceDate = getMonthStart();

  return rows
    .filter((row) => parseAmount(row.amount) > 0)
    .map((row) => ({
      title: row.label.trim(),
      amount: parseAmount(row.amount),
      kind: row.section === "income" ? "income" : "expense",
      category:
        row.section === "fixed"
          ? "Essencial"
          : row.section === "negotiable"
            ? "Negociável"
            : (row.incomeType ?? "Extra"),
      member: row.section === "fixed" ? "Casa" : "Responsável",
      dueDate: row.dueDate || competenceDate,
      competenceDate,
      account:
        row.section === "income"
          ? row.incomeType === "PJ"
            ? "Conta PJ"
            : "Conta principal"
          : row.section === "fixed"
            ? "Planejamento essencial"
            : "Renegociação",
    }));
}

function getTips({
  totalIncome,
  totalFixed,
  totalNegotiable,
  balance,
}: {
  totalIncome: number;
  totalFixed: number;
  totalNegotiable: number;
  balance: number;
}) {
  const tips = [];

  if (balance < 0) {
    tips.push(
      "O fechamento está negativo. Priorize aluguel, água, luz, comida e internet antes de tentar cobrir cartão ou limite.",
    );
  }

  if (totalNegotiable > 0) {
    tips.push(
      "Dívidas negociáveis pedem proposta única e realista. Melhor uma parcela que cabe todo mês do que um acordo que quebra no segundo boleto.",
    );
  }

  if (totalIncome > 0 && totalNegotiable > totalIncome * 0.3) {
    tips.push(
      "Quando a dívida negociável passa de 30% da renda, vale buscar desconto para quitação, pausa de juros ou alongamento do prazo.",
    );
  }

  if (totalFixed > 0 && totalIncome > 0 && totalFixed / totalIncome > 0.6) {
    tips.push(
      "Seus custos essenciais estão pesados. Revise contratos recorrentes e corte o que não trava a operação da casa.",
    );
  }

  tips.push(
    "Compra necessária pode ser parcelada para preservar caixa, mas tente antecipar parcelas quando entrar renda extra e o desconto compensar.",
  );
  tips.push(
    "Se o nome já está sujo, concentre energia em renegociar poucas frentes importantes e evitar novas bolas de neve ao mesmo tempo.",
  );

  return tips;
}

function PlanningTable({
  title,
  description,
  badge,
  icon,
  rows,
  onChange,
  incomeMode = false,
}: {
  title: string;
  description: string;
  badge: string;
  icon: ReactNode;
  rows: PlanningRow[];
  onChange: (
    id: string,
    key: "label" | "amount" | "dueDate" | "incomeType",
    value: string,
  ) => void;
  incomeMode?: boolean;
}) {
  return (
    <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-[0_22px_60px_-48px_rgba(80,64,153,0.34)]">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {badge}
            </Badge>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <p className="text-sm leading-6 text-slate-500">{description}</p>
            </div>
          </div>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
            {icon}
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-3"
            >
              <Input
                aria-label={`${title} nome ${index + 1}`}
                value={row.label}
                onChange={(event) =>
                  onChange(row.id, "label", event.target.value)
                }
                className="rounded-2xl border-white bg-white"
              />
              <div
                className={
                  incomeMode
                    ? "grid gap-3 sm:grid-cols-[0.9fr_1fr_1fr]"
                    : "grid gap-3 sm:grid-cols-[1fr_1fr]"
                }
              >
                {incomeMode ? (
                  <Select
                    value={row.incomeType ?? "Extra"}
                    onValueChange={(value) =>
                      onChange(row.id, "incomeType", value ?? "Extra")
                    }
                  >
                    <SelectTrigger
                      aria-label={`${title} tipo ${index + 1}`}
                      className="rounded-2xl border-white bg-white"
                    >
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                      <SelectItem value="Extra">Extra</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}
                <Input
                  aria-label={`${title} vencimento ${index + 1}`}
                  type="date"
                  value={row.dueDate}
                  onChange={(event) =>
                    onChange(row.id, "dueDate", event.target.value)
                  }
                  className="rounded-2xl border-white bg-white"
                />
                <Input
                  aria-label={`${title} valor ${index + 1}`}
                  inputMode="decimal"
                  placeholder="0,00"
                  value={row.amount}
                  onChange={(event) =>
                    onChange(row.id, "amount", event.target.value)
                  }
                  className="rounded-2xl border-white bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancePlanningSheet() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fixedRows, setFixedRows] = useState(fixedRowsTemplate);
  const [negotiableRows, setNegotiableRows] = useState(negotiableRowsTemplate);
  const [incomeRows, setIncomeRows] = useState(incomeRowsTemplate);

  const totalFixed = getRowTotal(fixedRows);
  const totalNegotiable = getRowTotal(negotiableRows);
  const totalIncome = getRowTotal(incomeRows);
  const totalExpense = totalFixed + totalNegotiable;
  const balance = totalIncome - totalExpense;
  const tips = getTips({
    totalIncome,
    totalFixed,
    totalNegotiable,
    balance,
  });

  function updateRows(
    setter: Dispatch<SetStateAction<PlanningRow[]>>,
    id: string,
    key: "label" | "amount" | "dueDate" | "incomeType",
    value: string,
  ) {
    setter((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [key]: value,
            }
          : row,
      ),
    );
  }

  function resetSheet() {
    setFixedRows(fixedRowsTemplate);
    setNegotiableRows(negotiableRowsTemplate);
    setIncomeRows(incomeRowsTemplate);
  }

  function handleSave() {
    const entries = buildEntries([
      ...fixedRows,
      ...negotiableRows,
      ...incomeRows,
    ]);

    if (!entries.length) {
      toast.error("Preencha ao menos uma linha com valor maior que zero.");
      return;
    }

    if (entries.some((entry) => entry.title.trim().length < 2)) {
      toast.error(
        "Cada linha salva precisa ter um nome com pelo menos 2 letras.",
      );
      return;
    }

    startTransition(async () => {
      const result = await createFinanceSheetEntriesAction(entries);

      if (!result.success) {
        toast.error("Não foi possível salvar a planilha rápida.");
        return;
      }

      toast.success("Linhas salvas nos lançamentos.");
      resetSheet();
      router.refresh();
    });
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Preenchimento rápido"
        description="Digite como em uma planilha: primeiro o essencial, depois as dívidas negociáveis e por fim as entradas CLT, PJ ou extras."
        action={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={resetSheet}
            >
              Limpar grade
            </Button>
            <Button
              type="button"
              disabled={isPending}
              className="rounded-2xl"
              onClick={handleSave}
            >
              {isPending ? "Salvando..." : "Salvar linhas preenchidas"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <PlanningTable
          title="Custos que não podem travar"
          description="Moradia e contas básicas entram primeiro para mostrar o custo mínimo da casa."
          badge="Essencial"
          icon={<House className="h-5 w-5" />}
          rows={fixedRows}
          onChange={(id, key, value) =>
            updateRows(setFixedRows, id, key, value)
          }
        />
        <PlanningTable
          title="Gastos negociáveis"
          description="Cartão, empréstimo e atrasos entram separados para ajudar na estratégia de saída."
          badge="Renegociável"
          icon={<HandCoins className="h-5 w-5" />}
          rows={negotiableRows}
          onChange={(id, key, value) =>
            updateRows(setNegotiableRows, id, key, value)
          }
        />
        <PlanningTable
          title="Entradas do mês"
          description="Classifique por CLT, PJ ou extra e veja o saldo disponível sem precisar montar fórmula."
          badge="Receita"
          icon={<CircleDollarSign className="h-5 w-5" />}
          rows={incomeRows}
          onChange={(id, key, value) =>
            updateRows(setIncomeRows, id, key, value)
          }
          incomeMode
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="rounded-[28px] border-white/80 bg-[linear-gradient(180deg,#ffffff,#f7f5ff)] shadow-[0_22px_60px_-48px_rgba(80,64,153,0.34)]">
          <CardContent className="space-y-4 p-5">
            <SectionHeader
              title="Leitura automática"
              description="Os totais abaixo saem direto da grade, sem precisar montar fórmulas."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm text-slate-500">Essencial</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {formatCurrency(totalFixed)}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm text-slate-500">Negociável</p>
                <p className="mt-2 text-lg font-semibold text-amber-600">
                  {formatCurrency(totalNegotiable)}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm text-slate-500">Entradas</p>
                <p className="mt-2 text-lg font-semibold text-emerald-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm text-slate-500">Saldo livre</p>
                <p
                  className={`mt-2 text-lg font-semibold ${
                    balance >= 0 ? "text-slate-950" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Total de saídas planejadas:{" "}
              <span className="font-semibold text-slate-950">
                {formatCurrency(totalExpense)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-amber-200 bg-[linear-gradient(180deg,#fffdf8,#fff8eb)] shadow-[0_22px_60px_-48px_rgba(170,122,33,0.35)]">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Estratégia para sair do aperto
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  Leitura educativa para priorizar o que não pode atrasar e
                  organizar uma saída possível do resto.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {tips.map((tip) => (
                <div
                  key={tip}
                  className="rounded-3xl border border-amber-200/70 bg-white/90 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {tip}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

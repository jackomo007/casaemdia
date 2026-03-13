import type {
  AccessState,
  BillingState,
  CalendarEventItem,
  ChildSummary,
  DashboardData,
  FinanceEntry,
  FinanceOverviewData,
  HealthReminder,
  HouseholdWorkspace,
  InsightCardData,
  ShoppingListSummary,
  TaskItem,
} from "@/types";

const baseEvents: CalendarEventItem[] = [
  {
    id: "event-school-uniform",
    title: "Uniforme azul para a escola",
    description: "Lembrar da camiseta azul e meia branca.",
    startsAt: "2026-03-16T07:00:00.000Z",
    kind: "school",
    badge: "Escola",
    childName: "Livia",
  },
  {
    id: "event-vaccine",
    title: "Reforco da vacina da gripe",
    description: "Levar carteirinha e documento.",
    startsAt: "2026-03-17T13:30:00.000Z",
    kind: "medical",
    badge: "Saude",
    childName: "Theo",
  },
  {
    id: "event-bill",
    title: "Vencimento do cartao Nubank",
    description: "Fechar o ciclo antes de novas compras grandes.",
    startsAt: "2026-03-18T12:00:00.000Z",
    kind: "billing",
    badge: "Financeiro",
  },
  {
    id: "event-couple",
    title: "Consulta do casal",
    description: "Sessao de acompanhamento marcada no centro.",
    startsAt: "2026-03-20T19:00:00.000Z",
    kind: "family",
    badge: "Familia",
  },
  {
    id: "event-school-meeting",
    title: "Reuniao pedagogica",
    description: "Feedback do bimestre e agenda de provas.",
    startsAt: "2026-03-21T10:00:00.000Z",
    kind: "school",
    badge: "Escola",
    childName: "Livia",
  },
];

const baseTasks: TaskItem[] = [
  {
    id: "task-lunchbox",
    title: "Preparar lanche da semana",
    description: "Separar frutas, sucos e potes para a escola.",
    dueDate: "2026-03-16T06:30:00.000Z",
    priority: "high",
    status: "todo",
    assignee: "Marina",
    subtasksDone: 1,
    subtasksTotal: 3,
  },
  {
    id: "task-electricity",
    title: "Conferir conta de energia",
    description: "Comparar com o consumo do mes passado.",
    dueDate: "2026-03-18T09:00:00.000Z",
    priority: "medium",
    status: "in_progress",
    assignee: "Rafael",
    subtasksDone: 2,
    subtasksTotal: 4,
  },
  {
    id: "task-math-homework",
    title: "Licao de matematica da Livia",
    description: "Pagina 42 e exercicios 3 a 8.",
    dueDate: "2026-03-17T18:00:00.000Z",
    priority: "high",
    status: "todo",
    assignee: "Livia",
    subtasksDone: 0,
    subtasksTotal: 2,
    points: 20,
  },
];

const baseShopping: ShoppingListSummary[] = [
  {
    id: "shop-week",
    title: "Mercado da semana",
    category: "Casa",
    estimatedTotal: 386.4,
    progress: 40,
    items: [
      {
        id: "item-rice",
        name: "Arroz integral",
        quantity: "2 pacotes",
        estimatedCost: 19.8,
        checked: true,
      },
      {
        id: "item-milk",
        name: "Leite sem lactose",
        quantity: "6 caixas",
        estimatedCost: 41.4,
        checked: false,
      },
      {
        id: "item-fruit",
        name: "Frutas da lancheira",
        quantity: "1 cesta",
        estimatedCost: 52,
        checked: false,
      },
    ],
  },
  {
    id: "shop-party",
    title: "Aniversario do Theo",
    category: "Evento",
    estimatedTotal: 212.9,
    progress: 20,
    items: [
      {
        id: "item-decoration",
        name: "Decoracao futebol",
        quantity: "1 kit",
        estimatedCost: 79.9,
        checked: false,
      },
      {
        id: "item-cake",
        name: "Bolo pequeno",
        quantity: "1 unidade",
        estimatedCost: 95,
        checked: false,
      },
    ],
  },
];

const baseInsights: InsightCardData[] = [
  {
    id: "insight-fixed-cost",
    title: "Gasto fixo alto em relacao a renda",
    content:
      "O custo fixo da casa esta em 76% da renda prevista do mes. Vale revisar assinaturas e compras recorrentes.",
    tone: "Atencao",
    kind: "financial",
    disclaimer:
      "Sugestao educativa. Nao representa consultoria financeira ou recomendacao regulada.",
  },
  {
    id: "insight-busy-week",
    title: "Semana carregada para escola e saude",
    content:
      "Os proximos 7 dias concentram 4 compromissos escolares e 2 medicos. Antecipe mochila, uniforme e documentos.",
    tone: "Organizacao",
    kind: "organization",
    disclaimer:
      "Insight gerado a partir dos registros atuais e pode mudar conforme novos eventos forem adicionados.",
  },
  {
    id: "insight-reserve",
    title: "Reserva de emergencia em 12 meses",
    content:
      "Se a familia reservar R$ 1.000 por mes, pode acumular R$ 12.000 em 1 ano para reduzir pressao em meses imprevistos.",
    tone: "Cenario",
    kind: "ideas",
    disclaimer:
      "Cenario estimado para fins educativos. Resultados dependem do comportamento financeiro real.",
  },
];

const baseChildren: ChildSummary[] = [
  {
    id: "child-livia",
    name: "Livia",
    age: 9,
    school: "Colegio Jardim das Letras",
    pendingTasks: 3,
    nextEvent: "Reuniao pedagogica em 21 de marco",
    note: "Levar caderno de leitura na segunda.",
  },
  {
    id: "child-theo",
    name: "Theo",
    age: 5,
    school: "Espaco Crescer",
    pendingTasks: 1,
    nextEvent: "Vacina da gripe em 17 de marco",
    note: "Separar roupa confortavel para a consulta.",
  },
];

const baseHealth: HealthReminder[] = [
  {
    id: "health-vaccine",
    title: "Vacina da gripe",
    description: "Reforco anual com carteirinha em maos.",
    dueDate: "2026-03-17T13:30:00.000Z",
    childName: "Theo",
  },
  {
    id: "health-dentist",
    title: "Dentista da familia",
    description: "Consulta preventiva do casal e avaliacao infantil.",
    dueDate: "2026-03-24T14:00:00.000Z",
  },
];

const financeEntries: FinanceEntry[] = [
  {
    id: "fin-income-clt",
    title: "Salario CLT Rafael",
    amount: 7800,
    kind: "income",
    category: "Salario",
    member: "Rafael",
    dueDate: "2026-03-05T10:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    paymentDate: "2026-03-05T10:00:00.000Z",
    status: "paid",
    account: "Conta principal",
  },
  {
    id: "fin-income-pj",
    title: "Freela design Marina",
    amount: 2600,
    kind: "income",
    category: "PJ",
    member: "Marina",
    dueDate: "2026-03-12T10:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    paymentDate: "2026-03-12T10:00:00.000Z",
    status: "paid",
    account: "Conta digital",
  },
  {
    id: "fin-expense-rent",
    title: "Aluguel",
    amount: 2400,
    kind: "expense",
    category: "Moradia",
    member: "Casa",
    dueDate: "2026-03-10T10:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    paymentDate: "2026-03-10T10:00:00.000Z",
    status: "paid",
    account: "Conta principal",
  },
  {
    id: "fin-expense-energy",
    title: "Conta de energia",
    amount: 286.5,
    kind: "expense",
    category: "Casa",
    member: "Casa",
    dueDate: "2026-03-18T10:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    status: "pending",
    account: "Conta principal",
  },
  {
    id: "fin-expense-card",
    title: "Cartao Nubank",
    amount: 1698.9,
    kind: "expense",
    category: "Cartao",
    member: "Marina",
    dueDate: "2026-03-18T12:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    status: "pending",
    account: "Nubank",
  },
  {
    id: "fin-expense-school",
    title: "Material escolar complementar",
    amount: 359.9,
    kind: "expense",
    category: "Escola",
    member: "Livia",
    dueDate: "2026-03-22T12:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    status: "pending",
    account: "Conta digital",
  },
];

const financeOverview: FinanceOverviewData = {
  summary: {
    income: 10800,
    expense: 6945.3,
    balance: 3854.7,
    forecast: 3012.3,
    fixedCostRatio: 76,
  },
  entries: financeEntries,
  categoryBreakdown: [
    { id: "cat-moradia", name: "Moradia", amount: 2400, percentage: 35 },
    { id: "cat-cartao", name: "Cartao", amount: 1698.9, percentage: 24 },
    { id: "cat-casa", name: "Casa", amount: 286.5, percentage: 4 },
    { id: "cat-escola", name: "Escola", amount: 359.9, percentage: 5 },
    {
      id: "cat-alimentacao",
      name: "Alimentacao",
      amount: 1120,
      percentage: 16,
    },
    { id: "cat-outros", name: "Outros", amount: 1080, percentage: 16 },
  ],
  monthlyFlow: [
    { label: "Out", income: 9600, expense: 7310, balance: 2290 },
    { label: "Nov", income: 10200, expense: 7590, balance: 2610 },
    { label: "Dez", income: 11500, expense: 9140, balance: 2360 },
    { label: "Jan", income: 9800, expense: 7820, balance: 1980 },
    { label: "Fev", income: 10700, expense: 7460, balance: 3240 },
    { label: "Mar", income: 10800, expense: 6945.3, balance: 3854.7 },
  ],
};

const dashboardBase: DashboardData = {
  greetingName: "Marina",
  householdName: "Familia Oliveira",
  monthLabel: "Marco de 2026",
  metrics: [
    {
      id: "metric-balance",
      label: "Saldo do mes",
      value: "R$ 3.854,70",
      helper: "Previsao ainda positiva para os proximos 12 dias",
      trend: "up",
    },
    {
      id: "metric-events",
      label: "Eventos nos proximos 7 dias",
      value: "6",
      helper: "Escola e saude concentram a agenda",
      trend: "neutral",
    },
    {
      id: "metric-tasks",
      label: "Tarefas pendentes",
      value: "9",
      helper: "3 de alta prioridade para esta semana",
      trend: "down",
    },
    {
      id: "metric-shopping",
      label: "Compras em aberto",
      value: "R$ 599,30",
      helper: "Mercado e aniversario do Theo",
      trend: "neutral",
    },
  ],
  alerts: [
    {
      id: "alert-card",
      title: "Cartao fecha em 5 dias",
      description: "Gastos em cartao subiram 18% em relacao ao mes passado.",
      priority: "high",
      href: "/dashboard/financas/dividas",
    },
    {
      id: "alert-school",
      title: "Semana escolar intensa",
      description:
        "Uniforme especial, reuniao pedagogica e material complementar.",
      priority: "medium",
      href: "/dashboard/agenda",
    },
    {
      id: "alert-vaccine",
      title: "Vacina agendada para Theo",
      description:
        "Levar carteirinha e um lanche leve para depois da consulta.",
      priority: "medium",
      href: "/dashboard/saude",
    },
  ],
  upcomingEvents: baseEvents.slice(0, 3),
  nextSevenDays: baseEvents,
  pendingTasks: baseTasks,
  shoppingLists: baseShopping,
  insights: baseInsights,
  children: baseChildren,
  healthReminders: baseHealth,
  finance: financeOverview.summary,
};

const billingHistoryBase = [
  {
    id: "bill-trial",
    label: "Trial inicial",
    amount: 0,
    status: "TRIALING" as const,
    createdAt: "2026-03-10T12:00:00.000Z",
  },
];

const scenarioAccess: Record<string, AccessState> = {
  trialing: {
    scenario: "trialing",
    status: "TRIALING",
    hasAccess: true,
    trialEndsAt: "2026-03-17T23:59:59.000Z",
  },
  active: {
    scenario: "active",
    status: "ACTIVE",
    hasAccess: true,
  },
  expired: {
    scenario: "expired",
    status: "EXPIRED",
    hasAccess: false,
    blockedReason:
      "O periodo gratis terminou. Seus dados continuam salvos para retomada quando quiser.",
    trialEndsAt: "2026-03-09T23:59:59.000Z",
  },
  past_due: {
    scenario: "past_due",
    status: "PAST_DUE",
    hasAccess: true,
    blockedReason:
      "Existe uma cobranca em aberto. O acesso segue liberado temporariamente para evitar ruptura.",
  },
};

export function getDemoAccessState(
  scenario: keyof typeof scenarioAccess,
): AccessState {
  return scenarioAccess[scenario];
}

export function getDemoWorkspace(
  scenario: keyof typeof scenarioAccess,
): HouseholdWorkspace {
  const access = getDemoAccessState(scenario);

  const billing: BillingState =
    scenario === "active"
      ? {
          status: "ACTIVE",
          planCode: "FAMILY_AI",
          planName: "Mensal Familia IA",
          currentPeriodEnd: "2026-04-10T12:00:00.000Z",
          renewalLabel: "Renovacao automatica em 10 de abril",
          history: [
            {
              id: "bill-active-1",
              label: "Assinatura Familia IA",
              amount: 39.9,
              status: "ACTIVE",
              createdAt: "2026-03-10T12:00:00.000Z",
            },
            ...billingHistoryBase,
          ],
          featureCodes: [
            "dashboard",
            "finance",
            "calendar",
            "tasks",
            "shopping",
            "children",
            "health",
            "ai",
          ],
        }
      : scenario === "past_due"
        ? {
            status: "PAST_DUE",
            planCode: "FAMILY",
            planName: "Mensal Familia",
            currentPeriodEnd: "2026-03-12T12:00:00.000Z",
            renewalLabel: "Pagamento pendente desde 12 de marco",
            history: [
              {
                id: "bill-past-due",
                label: "Tentativa de renovacao",
                amount: 29.9,
                status: "PAST_DUE",
                createdAt: "2026-03-12T12:00:00.000Z",
              },
            ],
            featureCodes: [
              "dashboard",
              "finance",
              "calendar",
              "tasks",
              "shopping",
              "children",
              "health",
            ],
          }
        : {
            status: access.status,
            planCode: "TRIAL",
            planName: "Trial gratis 7 dias",
            trialEndsAt:
              scenario === "expired"
                ? "2026-03-09T23:59:59.000Z"
                : "2026-03-17T23:59:59.000Z",
            renewalLabel:
              scenario === "expired"
                ? "Trial encerrado em 9 de marco"
                : "Trial expira em 17 de marco",
            history: billingHistoryBase,
            featureCodes: [
              "dashboard",
              "finance",
              "calendar",
              "tasks",
              "shopping",
              "children",
              "health",
              "ai",
            ],
          };

  return {
    dashboard: dashboardBase,
    finance: financeOverview,
    events: baseEvents,
    tasks: baseTasks,
    shoppingLists: baseShopping,
    insights: baseInsights,
    children: baseChildren,
    health: baseHealth,
    billing,
  };
}

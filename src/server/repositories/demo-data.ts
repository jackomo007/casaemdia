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
  SessionUser,
  ShoppingListSummary,
  TaskItem,
} from "@/types";

const baseEvents: CalendarEventItem[] = [
  {
    id: "event-school-uniform",
    title: "Separar materiais da reunião",
    description: "Levar documentos e anotações para alinhar a semana.",
    startsAt: "2026-03-16T07:00:00.000Z",
    kind: "school",
    priority: "medium",
  },
  {
    id: "event-vaccine",
    title: "Consulta de rotina",
    description: "Separar documentos e confirmar horário antes de sair.",
    startsAt: "2026-03-17T13:30:00.000Z",
    kind: "medical",
    priority: "medium",
  },
  {
    id: "event-bill",
    title: "Vencimento do cartão Nubank",
    description: "Fechar o ciclo antes de novas compras grandes.",
    startsAt: "2026-03-18T12:00:00.000Z",
    kind: "billing",
    priority: "high",
  },
  {
    id: "event-couple",
    title: "Reunião da casa",
    description: "Revisar contas, compras e prioridades dos próximos dias.",
    startsAt: "2026-03-20T19:00:00.000Z",
    kind: "family",
    priority: "low",
  },
  {
    id: "event-school-meeting",
    title: "Entrega de documentos",
    description: "Confirmar checklist e concluir pendências administrativas.",
    startsAt: "2026-03-21T10:00:00.000Z",
    kind: "school",
    priority: "medium",
  },
];

const baseTasks: TaskItem[] = [
  {
    id: "task-lunchbox",
    title: "Organizar compras da semana",
    description: "Separar itens urgentes e revisar o que falta em casa.",
    dueDate: "2026-03-16T06:30:00.000Z",
    priority: "high",
    status: "todo",
    assignee: "Ana",
    subtasksDone: 1,
    subtasksTotal: 3,
  },
  {
    id: "task-electricity",
    title: "Conferir conta de energia",
    description: "Comparar com o consumo do mês passado.",
    dueDate: "2026-03-18T09:00:00.000Z",
    priority: "medium",
    status: "in_progress",
    assignee: "Rafael",
    subtasksDone: 2,
    subtasksTotal: 4,
  },
  {
    id: "task-math-homework",
    title: "Separar material da manutenção",
    description:
      "Deixar ferramentas e lista de reparos prontos para o técnico.",
    dueDate: "2026-03-17T18:00:00.000Z",
    priority: "high",
    status: "todo",
    assignee: "Casa",
    subtasksDone: 0,
    subtasksTotal: 2,
  },
];

const baseShopping: ShoppingListSummary[] = [
  {
    id: "shop-week",
    title: "Mercado da semana",
    category: "Casa",
    description: "Reposição de alimentação, café da manhã e lancheira.",
    kind: "grocery",
    monthKey: "2026-03",
    estimatedTotal: 386.4,
    progress: 40,
    itemCount: 3,
    completedItems: 1,
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
    title: "Quarto de visitas",
    category: "Casa",
    description: "Planejar cama, roupa de cama e luminária do mês.",
    kind: "planned",
    monthKey: "2026-03",
    estimatedTotal: 212.9,
    progress: 20,
    itemCount: 2,
    completedItems: 0,
    items: [
      {
        id: "item-decoration",
        name: "Luminárias",
        quantity: "1 kit",
        estimatedCost: 79.9,
        checked: false,
      },
      {
        id: "item-cake",
        name: "Jogo de cama",
        quantity: "1 conjunto",
        estimatedCost: 95,
        checked: false,
      },
    ],
  },
];

const baseInsights: InsightCardData[] = [
  {
    id: "insight-fixed-cost",
    title: "Gasto fixo alto em relação à renda",
    content:
      "O custo fixo da casa está em 76% da renda prevista do mês. Vale revisar assinaturas e compras recorrentes.",
    tone: "Atenção",
    kind: "financial",
    disclaimer:
      "Sugestão educativa. Não representa consultoria financeira ou recomendação regulada.",
  },
  {
    id: "insight-busy-week",
    title: "Semana carregada na agenda",
    content:
      "Os próximos 7 dias concentram compromissos financeiros, tarefas e reuniões. Antecipe materiais e confirmações para evitar correria.",
    tone: "Organização",
    kind: "organization",
    disclaimer:
      "Insight gerado a partir dos registros atuais e pode mudar conforme novos eventos forem adicionados.",
  },
  {
    id: "insight-reserve",
    title: "Reserva de emergência em 12 meses",
    content:
      "Se a família reservar R$ 1.000 por mês, pode acumular R$ 12.000 em 1 ano para reduzir pressão em meses imprevistos.",
    tone: "Cenário",
    kind: "ideas",
    disclaimer:
      "Cenário estimado para fins educativos. Resultados dependem do comportamento financeiro real.",
  },
];

const baseChildren: ChildSummary[] = [];

const baseHealth: HealthReminder[] = [
  {
    id: "health-dentist",
    title: "Renovar receita do consultório",
    description: "Confirmar disponibilidade e separar os documentos.",
    dueDate: "2026-03-24T14:00:00.000Z",
  },
];

const financeEntries: FinanceEntry[] = [
  {
    id: "fin-income-clt",
    title: "Salário CLT Rafael",
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
    title: "Freela design Ana",
    amount: 2600,
    kind: "income",
    category: "PJ",
    member: "Ana",
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
    title: "Cartão Nubank",
    amount: 1698.9,
    kind: "expense",
    category: "Cartão",
    member: "Ana",
    dueDate: "2026-03-18T12:00:00.000Z",
    competenceDate: "2026-03-01T03:00:00.000Z",
    status: "pending",
    account: "Nubank",
  },
  {
    id: "fin-expense-school",
    title: "Material de escritorio",
    amount: 359.9,
    kind: "expense",
    category: "Operacao",
    member: "Casa",
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
    { id: "cat-cartao", name: "Cartão", amount: 1698.9, percentage: 24 },
    { id: "cat-casa", name: "Casa", amount: 286.5, percentage: 4 },
    { id: "cat-escola", name: "Escola", amount: 359.9, percentage: 5 },
    {
      id: "cat-alimentacao",
      name: "Alimentação",
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
  greetingName: "Ana",
  householdName: "Família Oliveira",
  monthLabel: "Março de 2026",
  metrics: [
    {
      id: "metric-balance",
      label: "Saldo do mês",
      value: "R$ 3.854,70",
      helper: "Previsão ainda positiva para os próximos 12 dias",
      trend: "up",
    },
    {
      id: "metric-events",
      label: "Eventos nos próximos 7 dias",
      value: "6",
      helper: "Agenda, contas e rotina concentram a semana",
      trend: "neutral",
    },
    {
      id: "metric-tasks",
      label: "Itens prioritarios",
      value: "5",
      helper: "3 itens de alta prioridade para esta semana",
      trend: "down",
    },
    {
      id: "metric-shopping",
      label: "Compras em aberto",
      value: "R$ 599,30",
      helper: "Mercado e reposicoes da operacao da casa",
      trend: "neutral",
    },
  ],
  alerts: [
    {
      id: "alert-card",
      title: "Cartão fecha em 5 dias",
      description: "Gastos em cartão subiram 18% em relação ao mês passado.",
      priority: "high",
      href: "/dashboard/financas/dividas",
    },
    {
      id: "alert-school",
      title: "Agenda concentrada",
      description:
        "Ha eventos, tarefas e documentos importantes no mesmo intervalo.",
      priority: "medium",
      href: "/dashboard/agenda",
    },
    {
      id: "alert-vaccine",
      title: "Lembrete de consulta",
      description: "Separe documentos e confirme o horario com antecedencia.",
      priority: "medium",
      href: "/dashboard/agenda",
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
      "O período grátis terminou. Seus dados continuam salvos para retomada quando quiser.",
    trialEndsAt: "2026-03-09T23:59:59.000Z",
  },
  past_due: {
    scenario: "past_due",
    status: "PAST_DUE",
    hasAccess: true,
    blockedReason:
      "Existe uma cobrança em aberto. O acesso segue liberado temporariamente para evitar ruptura.",
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
          planName: "Mensal Família IA",
          currentPeriodEnd: "2026-04-10T12:00:00.000Z",
          renewalLabel: "Renovação automática em 10 de abril",
          history: [
            {
              id: "bill-active-1",
              label: "Assinatura Família IA",
              amount: 39.9,
              status: "ACTIVE",
              createdAt: "2026-03-10T12:00:00.000Z",
            },
            ...billingHistoryBase,
          ],
          featureCodes: ["dashboard", "finance", "calendar", "shopping", "ai"],
        }
      : scenario === "past_due"
        ? {
            status: "PAST_DUE",
            planCode: "FAMILY",
            planName: "Mensal Família",
            currentPeriodEnd: "2026-03-12T12:00:00.000Z",
            renewalLabel: "Pagamento pendente desde 12 de março",
            history: [
              {
                id: "bill-past-due",
                label: "Tentativa de renovação",
                amount: 29.9,
                status: "PAST_DUE",
                createdAt: "2026-03-12T12:00:00.000Z",
              },
            ],
            featureCodes: ["dashboard", "finance", "calendar", "shopping"],
          }
        : {
            status: access.status,
            planCode: "TRIAL",
            planName: "Trial grátis 7 dias",
            trialEndsAt:
              scenario === "expired"
                ? "2026-03-09T23:59:59.000Z"
                : "2026-03-17T23:59:59.000Z",
            renewalLabel:
              scenario === "expired"
                ? "Trial encerrado em 9 de março"
                : "Trial expira em 17 de março",
            history: billingHistoryBase,
            featureCodes: [
              "dashboard",
              "finance",
              "calendar",
              "shopping",
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

function getFirstName(fullName?: string) {
  return fullName?.trim().split(/\s+/)[0] || "Família";
}

function getMonthLabel() {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function createBlankWorkspace(
  user?: Partial<SessionUser>,
  scenario: keyof typeof scenarioAccess = "trialing",
): HouseholdWorkspace {
  const access = getDemoAccessState(scenario);
  const fullName = user?.fullName?.trim() || "Nova família";
  const firstName = getFirstName(fullName);

  const summary = {
    income: 0,
    expense: 0,
    balance: 0,
    forecast: 0,
    fixedCostRatio: 0,
  };

  return {
    dashboard: {
      greetingName: firstName,
      householdName: `Casa de ${firstName}`,
      monthLabel: getMonthLabel(),
      metrics: [
        {
          id: "metric-balance",
          label: "Saldo do mês",
          value: "R$ 0,00",
          helper: "Preencha entradas e saídas para liberar a leitura do mês.",
          trend: "neutral",
        },
        {
          id: "metric-events",
          label: "Eventos nos próximos 7 dias",
          value: "0",
          helper: "Agenda vazia por enquanto.",
          trend: "neutral",
        },
        {
          id: "metric-tasks",
          label: "Itens prioritarios",
          value: "0",
          helper: "Nenhum item prioritario cadastrado ainda.",
          trend: "neutral",
        },
        {
          id: "metric-shopping",
          label: "Compras em aberto",
          value: "R$ 0,00",
          helper: "Nenhuma lista de compras ativa.",
          trend: "neutral",
        },
      ],
      alerts: [],
      upcomingEvents: [],
      nextSevenDays: [],
      pendingTasks: [],
      shoppingLists: [],
      insights: [
        {
          id: "insight-blank-start",
          title: "Comece pelo básico",
          content:
            "Preencha primeiro renda, moradia, energia, internet e dívidas negociáveis para o painel ficar útil já no primeiro uso.",
          tone: "Primeiros passos",
          kind: "ideas",
          disclaimer:
            "Sugestão educativa. Ajuste com sua realidade antes de decidir.",
        },
      ],
      children: [],
      healthReminders: [],
      finance: summary,
    },
    finance: {
      summary,
      entries: [],
      categoryBreakdown: [],
      monthlyFlow: [],
    },
    events: [],
    tasks: [],
    shoppingLists: [],
    insights: [
      {
        id: "insight-blank-finance",
        title: "Estruture renda e contas fixas",
        content:
          "Quando a renda e as despesas essenciais entram primeiro, sobra menos espaço para surpresas no resto do mês.",
        tone: "Base",
        kind: "financial",
        disclaimer: "Insight educativo. Não representa consultoria financeira.",
      },
    ],
    children: [],
    health: [],
    billing:
      scenario === "active"
        ? {
            status: "ACTIVE",
            planCode: "FAMILY",
            planName: "Mensal Família",
            currentPeriodEnd: "2026-04-10T12:00:00.000Z",
            renewalLabel: "Renovação automática em 10 de abril",
            history: [],
            featureCodes: [
              "dashboard",
              "finance",
              "calendar",
              "shopping",
              "ai",
            ],
          }
        : scenario === "past_due"
          ? {
              status: "PAST_DUE",
              planCode: "FAMILY",
              planName: "Mensal Família",
              currentPeriodEnd: "2026-03-12T12:00:00.000Z",
              renewalLabel: "Pagamento pendente desde 12 de março",
              history: [],
              featureCodes: ["dashboard", "finance", "calendar", "shopping"],
            }
          : {
              status: access.status,
              planCode: "TRIAL",
              planName: "Trial grátis 7 dias",
              trialEndsAt:
                scenario === "expired"
                  ? "2026-03-09T23:59:59.000Z"
                  : "2026-03-17T23:59:59.000Z",
              renewalLabel:
                scenario === "expired"
                  ? "Trial encerrado em 9 de março"
                  : "Trial expira em 17 de março",
              history: [],
              featureCodes: [
                "dashboard",
                "finance",
                "calendar",
                "shopping",
                "ai",
              ],
            },
  };
}

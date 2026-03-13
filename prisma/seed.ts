import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";

import { createPgPool } from "../src/lib/db/pool";
import { subscriptionPlans } from "../src/lib/constants/plans";

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/casaemdia?schema=public";

const pool = createPgPool(connectionString);
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const cleanupOperations = [
    () => prisma.paymentAttempt.deleteMany(),
    () => prisma.billingEvent.deleteMany(),
    () => prisma.billingCustomer.deleteMany(),
    () => prisma.trialAccess.deleteMany(),
    () => prisma.subscription.deleteMany(),
    () => prisma.subscriptionPlan.deleteMany(),
    () => prisma.featureGate.deleteMany(),
    () => prisma.usageSnapshot.deleteMany(),
    () => prisma.notification.deleteMany(),
    () => prisma.aIInsight.deleteMany(),
    () => prisma.attachment.deleteMany(),
    () => prisma.schoolReminder.deleteMany(),
    () => prisma.vaccineReminder.deleteMany(),
    () => prisma.healthRecord.deleteMany(),
    () => prisma.shoppingListItem.deleteMany(),
    () => prisma.shoppingList.deleteMany(),
    () => prisma.taskAssignment.deleteMany(),
    () => prisma.task.deleteMany(),
    () => prisma.calendarEvent.deleteMany(),
    () => prisma.billReminder.deleteMany(),
    () => prisma.debtEntry.deleteMany(),
    () => prisma.expenseEntry.deleteMany(),
    () => prisma.incomeEntry.deleteMany(),
    () => prisma.installmentPlan.deleteMany(),
    () => prisma.financialAccount.deleteMany(),
    () => prisma.category.deleteMany(),
    () => prisma.childProfile.deleteMany(),
    () => prisma.userPreference.deleteMany(),
    () => prisma.userHouseholdRole.deleteMany(),
    () => prisma.householdMember.deleteMany(),
    () => prisma.auditLog.deleteMany(),
    () => prisma.household.deleteMany(),
    () => prisma.user.deleteMany(),
  ];

  for (const operation of cleanupOperations) {
    await operation();
  }

  const [marina, rafael] = await Promise.all([
    prisma.user.create({
      data: {
        supabaseUserId: "seed-marina",
        email: "marina@familiaoliveira.com.br",
        fullName: "Marina Oliveira",
        phone: "+55 11 99999-1111",
      },
    }),
    prisma.user.create({
      data: {
        supabaseUserId: "seed-rafael",
        email: "rafael@familiaoliveira.com.br",
        fullName: "Rafael Oliveira",
        phone: "+55 11 98888-2222",
      },
    }),
  ]);

  const household = await prisma.household.create({
    data: {
      name: "Familia Oliveira",
      slug: "familia-oliveira",
      ownerUserId: marina.id,
      roles: {
        create: [
          { userId: marina.id, role: "OWNER" },
          { userId: rafael.id, role: "ADMIN" },
        ],
      },
      members: {
        create: [
          {
            userId: marina.id,
            displayName: "Marina",
            type: "ADULT",
            relationshipLabel: "Mae",
            isPrimaryContact: true,
          },
          {
            userId: rafael.id,
            displayName: "Rafael",
            type: "ADULT",
            relationshipLabel: "Pai",
          },
          {
            displayName: "Livia",
            type: "CHILD",
            relationshipLabel: "Filha",
            dateOfBirth: new Date("2016-04-09"),
          },
          {
            displayName: "Theo",
            type: "CHILD",
            relationshipLabel: "Filho",
            dateOfBirth: new Date("2020-07-18"),
          },
        ],
      },
    },
    include: {
      members: true,
    },
  });

  const liviaMember = household.members.find(
    (member) => member.displayName === "Livia",
  );
  const theoMember = household.members.find(
    (member) => member.displayName === "Theo",
  );
  const marinaMember = household.members.find(
    (member) => member.displayName === "Marina",
  );
  const rafaelMember = household.members.find(
    (member) => member.displayName === "Rafael",
  );

  if (!liviaMember || !theoMember || !marinaMember || !rafaelMember) {
    throw new Error("Membros principais nao encontrados.");
  }

  const [liviaProfile, theoProfile] = await Promise.all([
    prisma.childProfile.create({
      data: {
        householdId: household.id,
        householdMemberId: liviaMember.id,
        firstName: "Livia",
        schoolName: "Colegio Jardim das Letras",
        gradeLabel: "4o ano",
        notes: "Levar caderno de leitura na segunda.",
      },
    }),
    prisma.childProfile.create({
      data: {
        householdId: household.id,
        householdMemberId: theoMember.id,
        firstName: "Theo",
        schoolName: "Espaco Crescer",
        gradeLabel: "Infantil 5",
        notes: "Separar roupa confortavel para vacinas.",
      },
    }),
  ]);

  const categories = await prisma.category.createManyAndReturn({
    data: [
      {
        householdId: household.id,
        name: "Salario",
        slug: "salario",
        type: "INCOME",
        isSystem: true,
        color: "#8fd2ff",
      },
      {
        householdId: household.id,
        name: "PJ",
        slug: "pj",
        type: "INCOME",
        isSystem: true,
        color: "#7c5cff",
      },
      {
        householdId: household.id,
        name: "Moradia",
        slug: "moradia",
        type: "EXPENSE",
        color: "#ac8dff",
      },
      {
        householdId: household.id,
        name: "Cartao",
        slug: "cartao",
        type: "EXPENSE",
        color: "#7c5cff",
      },
      {
        householdId: household.id,
        name: "Escola",
        slug: "escola",
        type: "EXPENSE",
        color: "#ffc782",
      },
      {
        householdId: household.id,
        name: "Casa",
        slug: "casa",
        type: "EXPENSE",
        color: "#b9efc5",
      },
      {
        householdId: household.id,
        name: "Mercado",
        slug: "mercado",
        type: "SHOPPING",
        color: "#8fd2ff",
      },
      {
        householdId: household.id,
        name: "Rotina",
        slug: "rotina",
        type: "TASK",
        color: "#d7ccff",
      },
      {
        householdId: household.id,
        name: "Agenda",
        slug: "agenda",
        type: "EVENT",
        color: "#ac8dff",
      },
    ],
  });

  const findCategory = (slug: string) =>
    categories.find((category) => category.slug === slug)?.id;

  const [mainAccount, digitalAccount, cardAccount] = await Promise.all([
    prisma.financialAccount.create({
      data: {
        householdId: household.id,
        name: "Conta principal",
        type: "CHECKING",
        institutionName: "Banco do Brasil",
        currentBalance: 3854.7,
      },
    }),
    prisma.financialAccount.create({
      data: {
        householdId: household.id,
        name: "Conta digital",
        type: "DIGITAL_WALLET",
        institutionName: "Inter",
        currentBalance: 920,
      },
    }),
    prisma.financialAccount.create({
      data: {
        householdId: household.id,
        name: "Nubank",
        type: "CREDIT_CARD",
        institutionName: "Nubank",
        lastFourDigits: "4432",
        creditLimit: 6500,
        currentBalance: -1698.9,
      },
    }),
  ]);

  const installmentPlan = await prisma.installmentPlan.create({
    data: {
      householdId: household.id,
      accountId: cardAccount.id,
      title: "Notebook parcelado",
      totalAmount: 4800,
      installmentAmount: 400,
      totalInstallments: 12,
      currentInstallment: 5,
      startsAt: new Date("2025-11-10"),
      status: "OPEN",
    },
  });

  await prisma.incomeEntry.createMany({
    data: [
      {
        householdId: household.id,
        categoryId: findCategory("salario"),
        accountId: mainAccount.id,
        memberId: rafaelMember.id,
        title: "Salario CLT Rafael",
        amount: 7800,
        competenceDate: new Date("2026-03-01"),
        dueDate: new Date("2026-03-05"),
        receivedAt: new Date("2026-03-05"),
        status: "PAID",
      },
      {
        householdId: household.id,
        categoryId: findCategory("pj"),
        accountId: digitalAccount.id,
        memberId: marinaMember.id,
        title: "Freela design Marina",
        amount: 2600,
        competenceDate: new Date("2026-03-01"),
        dueDate: new Date("2026-03-12"),
        receivedAt: new Date("2026-03-12"),
        status: "PAID",
      },
    ],
  });

  await prisma.expenseEntry.createMany({
    data: [
      {
        householdId: household.id,
        categoryId: findCategory("moradia"),
        accountId: mainAccount.id,
        title: "Aluguel",
        amount: 2400,
        competenceDate: new Date("2026-03-01"),
        dueDate: new Date("2026-03-10"),
        paidAt: new Date("2026-03-10"),
        status: "PAID",
        isFixed: true,
      },
      {
        householdId: household.id,
        categoryId: findCategory("casa"),
        accountId: mainAccount.id,
        title: "Conta de energia",
        amount: 286.5,
        competenceDate: new Date("2026-03-01"),
        dueDate: new Date("2026-03-18"),
        status: "PENDING",
        isFixed: true,
      },
      {
        householdId: household.id,
        categoryId: findCategory("cartao"),
        accountId: cardAccount.id,
        memberId: marinaMember.id,
        installmentPlanId: installmentPlan.id,
        title: "Cartao Nubank",
        amount: 1698.9,
        competenceDate: new Date("2026-03-01"),
        dueDate: new Date("2026-03-18"),
        status: "PENDING",
      },
      {
        householdId: household.id,
        categoryId: findCategory("escola"),
        accountId: digitalAccount.id,
        memberId: liviaMember.id,
        title: "Material escolar complementar",
        amount: 359.9,
        competenceDate: new Date("2026-03-01"),
        dueDate: new Date("2026-03-22"),
        status: "PENDING",
      },
    ],
  });

  await prisma.debtEntry.create({
    data: {
      householdId: household.id,
      categoryId: findCategory("cartao"),
      accountId: cardAccount.id,
      title: "Saldo rotativo do cartao",
      principalAmount: 1698.9,
      outstandingAmount: 1698.9,
      interestRate: 12.9,
      dueDate: new Date("2026-03-18"),
      status: "OPEN",
      installmentPlanId: installmentPlan.id,
    },
  });

  await prisma.billReminder.createMany({
    data: [
      {
        householdId: household.id,
        categoryId: findCategory("casa"),
        accountId: mainAccount.id,
        title: "Internet fibra",
        amount: 129.9,
        dueDate: new Date("2026-03-14"),
        recurrenceRule: "MONTHLY",
      },
      {
        householdId: household.id,
        categoryId: findCategory("casa"),
        accountId: mainAccount.id,
        title: "Agua",
        amount: 89.4,
        dueDate: new Date("2026-03-20"),
        recurrenceRule: "MONTHLY",
      },
    ],
  });

  await prisma.calendarEvent.createMany({
    data: [
      {
        householdId: household.id,
        categoryId: findCategory("agenda"),
        childProfileId: liviaProfile.id,
        memberId: liviaMember.id,
        title: "Uniforme azul para a escola",
        description: "Lembrar da camiseta azul e meia branca.",
        startsAt: new Date("2026-03-16T07:00:00"),
        type: "SCHOOL",
      },
      {
        householdId: household.id,
        categoryId: findCategory("agenda"),
        childProfileId: theoProfile.id,
        memberId: theoMember.id,
        title: "Reforco da vacina da gripe",
        description: "Levar carteirinha e documento.",
        startsAt: new Date("2026-03-17T13:30:00"),
        type: "MEDICAL",
      },
      {
        householdId: household.id,
        categoryId: findCategory("agenda"),
        title: "Consulta do casal",
        description: "Sessao de acompanhamento marcada no centro.",
        startsAt: new Date("2026-03-20T19:00:00"),
        type: "FAMILY",
      },
    ],
  });

  const [task1, task2] = await Promise.all([
    prisma.task.create({
      data: {
        householdId: household.id,
        categoryId: findCategory("rotina"),
        title: "Preparar lanche da semana",
        description: "Separar frutas, sucos e potes para a escola.",
        dueDate: new Date("2026-03-16T06:30:00"),
        priority: "HIGH",
      },
    }),
    prisma.task.create({
      data: {
        householdId: household.id,
        categoryId: findCategory("rotina"),
        childProfileId: liviaProfile.id,
        title: "Licao de matematica da Livia",
        description: "Pagina 42 e exercicios 3 a 8.",
        dueDate: new Date("2026-03-17T18:00:00"),
        priority: "HIGH",
        rewardPoints: 20,
      },
    }),
  ]);

  await prisma.taskAssignment.createMany({
    data: [
      { taskId: task1.id, memberId: marinaMember.id, userId: marina.id },
      { taskId: task2.id, memberId: liviaMember.id },
    ],
  });

  const shoppingList = await prisma.shoppingList.create({
    data: {
      householdId: household.id,
      categoryId: findCategory("mercado"),
      title: "Mercado da semana",
      estimatedTotal: 386.4,
    },
  });

  await prisma.shoppingListItem.createMany({
    data: [
      {
        shoppingListId: shoppingList.id,
        householdId: household.id,
        categoryId: findCategory("mercado"),
        name: "Arroz integral",
        quantityLabel: "2 pacotes",
        estimatedCost: 19.8,
        isPurchased: true,
      },
      {
        shoppingListId: shoppingList.id,
        householdId: household.id,
        categoryId: findCategory("mercado"),
        name: "Leite sem lactose",
        quantityLabel: "6 caixas",
        estimatedCost: 41.4,
      },
    ],
  });

  await prisma.healthRecord.createMany({
    data: [
      {
        householdId: household.id,
        childProfileId: theoProfile.id,
        memberId: theoMember.id,
        title: "Alergia leve a poeira",
        recordType: "ALLERGY",
        notes: "Monitorar mudancas de clima e uso de inalador.",
        recordedAt: new Date("2026-02-01"),
      },
      {
        householdId: household.id,
        childProfileId: liviaProfile.id,
        memberId: liviaMember.id,
        title: "Consulta pediatrica",
        recordType: "CONSULTATION",
        notes: "Crescimento dentro do esperado.",
        recordedAt: new Date("2026-01-20"),
      },
    ],
  });

  await prisma.vaccineReminder.create({
    data: {
      householdId: household.id,
      childProfileId: theoProfile.id,
      vaccineName: "Influenza",
      dueDate: new Date("2026-03-17T13:30:00"),
      notes: "Levar carteirinha.",
    },
  });

  await prisma.schoolReminder.createMany({
    data: [
      {
        householdId: household.id,
        childProfileId: liviaProfile.id,
        memberId: liviaMember.id,
        type: "UNIFORM",
        title: "Roupa azul na escola",
        dueDate: new Date("2026-03-16T07:00:00"),
        notes: "Meia branca e tenis limpo.",
      },
      {
        householdId: household.id,
        childProfileId: liviaProfile.id,
        memberId: liviaMember.id,
        type: "MATERIAL",
        title: "Levar cartolina e cola",
        dueDate: new Date("2026-03-21T10:00:00"),
        notes: "Trabalho em grupo de ciencias.",
      },
    ],
  });

  await prisma.aIInsight.createMany({
    data: [
      {
        householdId: household.id,
        type: "FINANCIAL",
        title: "Gasto fixo alto em relacao a renda",
        content:
          "O custo fixo esta em 76% da renda prevista. Vale revisar recorrencias e compras por impulso.",
        disclaimer: "Insight educativo. Nao representa consultoria financeira.",
        modelName: "mock-family-ops",
        promptVersion: "v1",
      },
      {
        householdId: household.id,
        type: "ORGANIZATION",
        title: "Semana carregada para escola e saude",
        content:
          "Os proximos 7 dias concentram compromissos escolares e medicos. Antecipe mochila e documentos.",
        disclaimer: "Insight baseado nos registros atuais.",
        modelName: "mock-family-ops",
        promptVersion: "v1",
      },
    ],
  });

  await prisma.notification.create({
    data: {
      householdId: household.id,
      userId: marina.id,
      type: "TASK",
      title: "3 tarefas pendentes de alta prioridade",
      content: "Lanche da semana, licao da Livia e revisar conta de energia.",
    },
  });

  await prisma.userPreference.createMany({
    data: [
      {
        householdId: household.id,
        userId: marina.id,
      },
      {
        householdId: household.id,
        userId: rafael.id,
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      householdId: household.id,
      actorUserId: marina.id,
      action: "seed.bootstrap",
      entityType: "household",
      entityId: household.id,
      metadata: { source: "prisma:seed" },
    },
  });

  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.create({
      data: {
        code: plan.code,
        name: plan.name,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        currency: "BRL",
        isActive: true,
        isFreeTrialEligible: plan.code === "TRIAL",
        trialDays: plan.code === "TRIAL" ? 7 : 0,
        features: {
          highlights: plan.featureHighlights,
          familySeats: plan.familySeats,
          hasAI: plan.hasAI,
        },
      },
    });
  }

  await prisma.featureGate.createMany({
    data: [
      {
        code: "dashboard",
        name: "Dashboard",
        description: "Visao geral da familia",
      },
      {
        code: "finance",
        name: "Finanças",
        description: "Fluxo financeiro e contas",
      },
      {
        code: "calendar",
        name: "Agenda",
        description: "Calendario e compromissos",
      },
      {
        code: "tasks",
        name: "Tarefas",
        description: "Checklist da casa e dos filhos",
      },
      { code: "shopping", name: "Compras", description: "Lista de compras" },
      {
        code: "ai",
        name: "Insights IA",
        description: "Camada de analise com IA",
      },
    ],
  });

  const familyAIPlan = await prisma.subscriptionPlan.findUniqueOrThrow({
    where: { code: "FAMILY_AI" },
  });

  const essentialPlan = await prisma.subscriptionPlan.findUniqueOrThrow({
    where: { code: "ESSENTIAL" },
  });

  const activeSubscription = await prisma.subscription.create({
    data: {
      householdId: household.id,
      userId: marina.id,
      planId: familyAIPlan.id,
      provider: "MERCADO_PAGO",
      providerCustomerId: "mp_customer_oliveira",
      providerSubscriptionId: "mp_sub_oliveira",
      status: SubscriptionStatus.ACTIVE,
      startsAt: new Date("2026-03-10T12:00:00"),
      trialStartsAt: new Date("2026-03-03T12:00:00"),
      trialEndsAt: new Date("2026-03-10T11:59:59"),
      currentPeriodStart: new Date("2026-03-10T12:00:00"),
      currentPeriodEnd: new Date("2026-04-10T12:00:00"),
    },
  });

  await prisma.paymentAttempt.create({
    data: {
      subscriptionId: activeSubscription.id,
      provider: "MERCADO_PAGO",
      providerPaymentId: "mp_pay_oliveira_001",
      amount: 39.9,
      currency: "BRL",
      status: "APPROVED",
      paidAt: new Date("2026-03-10T12:01:00"),
    },
  });

  await prisma.billingCustomer.create({
    data: {
      householdId: household.id,
      provider: "MERCADO_PAGO",
      providerCustomerId: "mp_customer_oliveira",
      email: marina.email,
      fullName: marina.fullName,
      document: "11122233344",
    },
  });

  await prisma.billingEvent.create({
    data: {
      householdId: household.id,
      provider: "MERCADO_PAGO",
      eventType: "subscription.payment_approved",
      status: "PROCESSED",
      processedAt: new Date("2026-03-10T12:02:00"),
      payload: { subscription: activeSubscription.id },
    },
  });

  await prisma.usageSnapshot.create({
    data: {
      householdId: household.id,
      referenceMonth: new Date("2026-03-01"),
      activeMembers: 4,
      totalEvents: 3,
      totalTasks: 2,
      totalEntries: 6,
      storageBytes: BigInt(1024 * 1024 * 12),
    },
  });

  const expiredHousehold = await prisma.household.create({
    data: {
      name: "Familia Santos",
      slug: "familia-santos",
      ownerUserId: marina.id,
    },
  });

  await prisma.trialAccess.createMany({
    data: [
      {
        householdId: household.id,
        emailNormalized: "marina@familiaoliveira.com.br",
        startedAt: new Date("2026-03-03T12:00:00"),
        endsAt: new Date("2026-03-10T11:59:59"),
        convertedToPaidAt: new Date("2026-03-10T12:00:00"),
        origin: "landing",
      },
      {
        householdId: expiredHousehold.id,
        emailNormalized: "familiasantos@example.com",
        startedAt: new Date("2026-03-01T08:00:00"),
        endsAt: new Date("2026-03-08T08:00:00"),
        expiredAt: new Date("2026-03-08T08:00:00"),
        origin: "trial",
      },
    ],
  });

  await prisma.subscription.create({
    data: {
      householdId: expiredHousehold.id,
      planId: essentialPlan.id,
      provider: "MERCADO_PAGO",
      status: SubscriptionStatus.EXPIRED,
      startsAt: new Date("2026-02-01T12:00:00"),
      endedAt: new Date("2026-03-01T12:00:00"),
      currentPeriodStart: new Date("2026-02-01T12:00:00"),
      currentPeriodEnd: new Date("2026-03-01T12:00:00"),
    },
  });

  console.log(
    "Seed concluido com dados da familia brasileira e cenarios de trial/billing.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

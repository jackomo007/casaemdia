import "server-only";

import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { subscriptionPlans } from "@/lib/constants/plans";
import { getWorkspaceSession } from "@/lib/auth/session";
import { provisionUserWorkspace } from "@/server/services/account-provisioning-service";
import {
  activatePlan,
  getWorkspaceSnapshot,
} from "@/server/repositories/demo-store";
import type { BillingState, BillingStatus, PlanCode } from "@/types";

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

function buildBillingHistory(
  subscriptions: Array<{
    id: string;
    createdAt: Date;
    status: BillingState["status"];
    plan: {
      code: string;
      name: string;
      priceMonthly: { toNumber(): number };
    };
  }>,
) {
  return subscriptions.map((subscription) => ({
    id: subscription.id,
    label: subscription.plan.name,
    amount: subscription.plan.priceMonthly.toNumber(),
    status: subscription.status,
    createdAt: subscription.createdAt.toISOString(),
  }));
}

export async function getPlanCatalog() {
  return subscriptionPlans.filter((plan) => plan.code !== "TRIAL");
}

export async function getBillingState(): Promise<BillingState> {
  const session = await getWorkspaceSession();

  if (
    session.workspacePreset === "sample" ||
    !session.user?.email ||
    !isDatabaseConfigured()
  ) {
    return getWorkspaceSnapshot(session).billing;
  }

  const workspace = await provisionUserWorkspace({
    email: session.user.email,
    fullName: session.user.fullName,
  });

  if (!workspace) {
    return getWorkspaceSnapshot(session).billing;
  }

  const [subscriptions, trialAccess] = await Promise.all([
    prisma.subscription.findMany({
      where: { householdId: workspace.household.id },
      include: {
        plan: {
          select: {
            code: true,
            name: true,
            priceMonthly: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 6,
    }),
    prisma.trialAccess.findFirst({
      where: {
        householdId: workspace.household.id,
        emailNormalized: session.user.email.toLowerCase(),
      },
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  const [currentSubscription] = subscriptions;
  const history = buildBillingHistory(subscriptions);
  const now = new Date();

  if (currentSubscription) {
    const currentPeriodEnd = currentSubscription.currentPeriodEnd;
    const isActive =
      currentSubscription.status === "ACTIVE" &&
      (!currentPeriodEnd || currentPeriodEnd > now);
    const status: BillingStatus = isActive
      ? "ACTIVE"
      : currentSubscription.status === "PAST_DUE"
        ? "PAST_DUE"
        : currentSubscription.status === "CANCELED"
          ? "CANCELED"
          : currentSubscription.status === "INCOMPLETE"
            ? "INCOMPLETE"
            : "EXPIRED";

    return {
      status,
      planCode: currentSubscription.plan.code as PlanCode,
      planName: currentSubscription.plan.name,
      currentPeriodEnd: currentPeriodEnd?.toISOString(),
      renewalLabel:
        status === "PAST_DUE"
          ? `Pagamento pendente desde ${formatDateLabel(currentPeriodEnd ?? currentSubscription.createdAt)}`
          : currentPeriodEnd
            ? `Renovação automática em ${formatDateLabel(currentPeriodEnd)}`
            : "Assinatura ativa",
      history,
      featureCodes: [],
    };
  }

  if (
    trialAccess &&
    !trialAccess.expiredAt &&
    !trialAccess.convertedToPaidAt &&
    trialAccess.endsAt > now
  ) {
    return {
      status: "TRIALING",
      planCode: "TRIAL",
      planName: "Trial grátis 7 dias",
      trialEndsAt: trialAccess.endsAt.toISOString(),
      renewalLabel: `Acesso liberado até ${formatDateLabel(trialAccess.endsAt)}`,
      history,
      featureCodes: [],
    };
  }

  return {
    status: "EXPIRED",
    planCode: "TRIAL",
    planName: "Trial grátis 7 dias",
    trialEndsAt: trialAccess?.endsAt?.toISOString(),
    renewalLabel: trialAccess?.endsAt
      ? `Trial encerrado em ${formatDateLabel(trialAccess.endsAt)}`
      : "Nenhum plano ativo nesta conta",
    history,
    featureCodes: [],
  };
}

export async function activateSubscriptionPlan(planCode: PlanCode) {
  const session = await getWorkspaceSession();

  if (
    session.workspacePreset !== "sample" &&
    session.user?.email &&
    isDatabaseConfigured()
  ) {
    const workspace = await provisionUserWorkspace({
      email: session.user.email,
      fullName: session.user.fullName,
    });

    if (workspace) {
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { code: planCode },
      });

      if (plan) {
        const now = new Date();
        const currentPeriodEnd = new Date(now);
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

        await prisma.subscription.updateMany({
          where: {
            householdId: workspace.household.id,
            status: {
              in: ["ACTIVE", "TRIALING", "PAST_DUE", "INCOMPLETE"],
            },
          },
          data: {
            status: "CANCELED",
            endedAt: now,
            canceledAt: now,
          },
        });

        const subscription = await prisma.subscription.create({
          data: {
            householdId: workspace.household.id,
            userId: workspace.user.id,
            planId: plan.id,
            provider: "MERCADO_PAGO",
            providerCustomerId: `mp_customer_${workspace.user.id}`,
            providerSubscriptionId: `mp_sub_${Date.now()}`,
            status: "ACTIVE",
            startsAt: now,
            currentPeriodStart: now,
            currentPeriodEnd,
          },
        });

        await prisma.billingEvent.create({
          data: {
            householdId: workspace.household.id,
            provider: "MERCADO_PAGO",
            eventType: "subscription.activated",
            status: "PROCESSED",
            processedAt: now,
            payload: {
              subscriptionId: subscription.id,
              planCode,
            },
          },
        });

        await prisma.trialAccess.updateMany({
          where: {
            householdId: workspace.household.id,
            emailNormalized: session.user.email.toLowerCase(),
            convertedToPaidAt: null,
          },
          data: {
            convertedToPaidAt: now,
          },
        });
      }
    }
  }

  return activatePlan({ ...session, scenario: "active" }, planCode).billing;
}

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { subscriptionPlans } from "../src/lib/constants/plans";
import { createPgPool } from "../src/lib/db/pool";

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/casaemdia?schema=public";

const pool = createPgPool(connectionString);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly ?? null,
        currency: "BRL",
        isActive: true,
        isFreeTrialEligible: plan.code === "TRIAL",
        trialDays: plan.code === "TRIAL" ? 7 : 0,
        features: {
          highlights: plan.featureHighlights,
          familySeats: plan.familySeats,
          hasAI: plan.hasAI,
          recommended: plan.recommended ?? false,
        },
      },
      create: {
        code: plan.code,
        name: plan.name,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly ?? null,
        currency: "BRL",
        isActive: true,
        isFreeTrialEligible: plan.code === "TRIAL",
        trialDays: plan.code === "TRIAL" ? 7 : 0,
        features: {
          highlights: plan.featureHighlights,
          familySeats: plan.familySeats,
          hasAI: plan.hasAI,
          recommended: plan.recommended ?? false,
        },
      },
    });
  }

  console.log("Seed minimo aplicado: somente planos foram sincronizados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
    await pool.end().catch(() => {});
  });

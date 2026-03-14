import "server-only";

import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";

type ProvisionUserInput = {
  email: string;
  fullName?: string | null;
  supabaseUserId?: string | null;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function getFirstName(fullName?: string | null) {
  return fullName?.trim().split(/\s+/)[0] || "Família";
}

function isMissingUserPreferenceTable(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    error.message.includes("public.UserPreference")
  );
}

async function ensureDefaultUserPreference(
  householdId: string,
  userId: string,
) {
  try {
    await prisma.userPreference.upsert({
      where: {
        householdId_userId: {
          householdId,
          userId,
        },
      },
      update: {},
      create: {
        householdId,
        userId,
      },
    });
  } catch (error) {
    if (isMissingUserPreferenceTable(error)) {
      console.warn(
        "Skipping default user preference creation because the UserPreference table is missing.",
      );
      return;
    }

    throw error;
  }
}

export async function provisionUserWorkspace(input: ProvisionUserInput) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const firstName = getFirstName(input.fullName);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      fullName: input.fullName?.trim() || undefined,
      supabaseUserId: input.supabaseUserId ?? undefined,
    },
    create: {
      email: normalizedEmail,
      fullName: input.fullName?.trim() || null,
      supabaseUserId: input.supabaseUserId ?? null,
    },
  });

  let household = await prisma.household.findFirst({
    where: {
      ownerUserId: user.id,
    },
  });

  if (!household) {
    household = await prisma.household.create({
      data: {
        name: `Casa de ${firstName}`,
        slug: `${slugify(`${firstName}-${normalizedEmail.split("@")[0]}`)}-${randomUUID().slice(0, 8)}`,
        ownerUserId: user.id,
        roles: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
        members: {
          create: {
            userId: user.id,
            displayName: firstName,
            type: "ADULT",
            relationshipLabel: "Responsável",
            isPrimaryContact: true,
          },
        },
        trialAccesses: {
          create: {
            emailNormalized: normalizedEmail,
            startedAt: new Date(),
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            origin: "auth.sign_up",
          },
        },
      },
    });
  }

  await ensureDefaultUserPreference(household.id, user.id);

  return {
    user,
    household,
  };
}

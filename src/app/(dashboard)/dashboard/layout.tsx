import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAccessState, getSessionUser } from "@/lib/auth/session";
import { canAccessPrivateApp } from "@/lib/permissions/access";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, access] = await Promise.all([
    getSessionUser(),
    getAccessState(),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!canAccessPrivateApp(access)) {
    redirect("/billing/locked");
  }

  return <AppShell topbarTitle="Painel operacional">{children}</AppShell>;
}

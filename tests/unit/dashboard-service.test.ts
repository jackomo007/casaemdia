vi.mock("server-only", () => ({}));

import { getDashboardData } from "@/server/services/dashboard-service";

vi.mock("@/lib/auth/session", () => ({
  getWorkspaceSession: vi.fn(),
}));

vi.mock("@/server/repositories/demo-store", () => ({
  getWorkspaceSnapshot: vi.fn(),
}));

import { getWorkspaceSession } from "@/lib/auth/session";
import { getWorkspaceSnapshot } from "@/server/repositories/demo-store";

describe("dashboard service", () => {
  it("usa o primeiro nome do usuario autenticado na saudacao", async () => {
    vi.mocked(getWorkspaceSession).mockResolvedValue({
      scenario: "trialing",
      workspacePreset: "blank",
      workspaceKey: "blank:carlos@example.com",
      user: {
        email: "carlos@example.com",
        fullName: "Carlos Eduardo",
      },
    });

    vi.mocked(getWorkspaceSnapshot).mockReturnValue({
      dashboard: {
        greetingName: "Pessoa Demo",
        householdName: "Casa de Carlos",
        monthLabel: "Março de 2026",
        metrics: [],
        alerts: [],
        upcomingEvents: [],
        nextSevenDays: [],
        pendingTasks: [],
        shoppingLists: [],
        insights: [],
        children: [],
        healthReminders: [],
        finance: {
          income: 0,
          expense: 0,
          balance: 0,
          forecast: 0,
          fixedCostRatio: 0,
        },
      },
      finance: {
        summary: {
          income: 0,
          expense: 0,
          balance: 0,
          forecast: 0,
          fixedCostRatio: 0,
        },
        entries: [],
        categoryBreakdown: [],
        monthlyFlow: [],
      },
      events: [],
      tasks: [],
      shoppingLists: [],
      insights: [],
      children: [],
      health: [],
      billing: {
        status: "TRIALING",
        planCode: "TRIAL",
        planName: "Trial",
        trialEndsAt: "2026-03-20T00:00:00.000Z",
        renewalLabel: "Trial",
        history: [],
        featureCodes: [],
      },
    });

    const result = await getDashboardData();

    expect(result.greetingName).toBe("Carlos");
  });
});

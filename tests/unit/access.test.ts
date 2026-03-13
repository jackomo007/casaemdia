import {
  canAccessPrivateApp,
  getBlockedMessage,
  shouldShowUpgrade,
} from "@/lib/permissions/access";

describe("access permissions", () => {
  it("permite acesso durante o trial", () => {
    const access = {
      scenario: "trialing",
      status: "TRIALING",
      hasAccess: true,
    } as const;

    expect(canAccessPrivateApp(access)).toBe(true);
    expect(shouldShowUpgrade(access)).toBe(false);
  });

  it("bloqueia acesso quando o trial expira", () => {
    const access = {
      scenario: "expired",
      status: "EXPIRED",
      hasAccess: false,
    } as const;

    expect(canAccessPrivateApp(access)).toBe(false);
    expect(shouldShowUpgrade(access)).toBe(true);
    expect(getBlockedMessage(access.status)).toContain("trial terminou");
  });
});

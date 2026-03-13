import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { applySensitiveRouteHeaders } from "@/lib/security";

const privatePrefixes = ["/dashboard"];
const publicOnlyRoutes = ["/login", "/register"];
const sensitivePrefixes = [
  "/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/billing",
  "/select-plan",
  "/onboarding",
];

function normalizeScenario(value?: string | null) {
  if (value === "active" || value === "expired" || value === "past_due") {
    return value;
  }

  return "trialing";
}

function canAccess(scenario: string) {
  return scenario !== "expired";
}

function isSensitiveRoute(pathname: string) {
  return sensitivePrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = privatePrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const session = request.cookies.get("family-session")?.value;
  const scenario = normalizeScenario(
    request.cookies.get("family-scenario")?.value,
  );

  if (isPrivateRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return applySensitiveRouteHeaders(NextResponse.redirect(loginUrl));
  }

  if (isPublicOnlyRoute && session) {
    return applySensitiveRouteHeaders(
      NextResponse.redirect(
        new URL(canAccess(scenario) ? "/dashboard" : "/dashboard", request.url),
      ),
    );
  }

  const response = NextResponse.next();

  if (isSensitiveRoute(pathname)) {
    applySensitiveRouteHeaders(response);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/billing/:path*",
    "/select-plan",
    "/onboarding",
  ],
};

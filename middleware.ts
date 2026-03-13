import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const privatePrefixes = ["/dashboard"];
const publicOnlyRoutes = ["/login", "/register"];

function normalizeScenario(value?: string | null) {
  if (value === "active" || value === "expired" || value === "past_due") {
    return value;
  }

  return "trialing";
}

function canAccess(scenario: string) {
  return scenario !== "expired";
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
    return NextResponse.redirect(loginUrl);
  }

  if (isPrivateRoute && !canAccess(scenario)) {
    return NextResponse.redirect(new URL("/billing/locked", request.url));
  }

  if (isPublicOnlyRoute && session) {
    return NextResponse.redirect(
      new URL(
        canAccess(scenario) ? "/dashboard" : "/billing/locked",
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

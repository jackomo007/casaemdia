import "server-only";

import { headers } from "next/headers";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

function getWindowMs() {
  const value = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
  return Number.isFinite(value) && value > 0 ? value : 15 * 60 * 1000;
}

function getMaxAttempts() {
  const value = Number(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS ?? 5);
  return Number.isFinite(value) && value > 0 ? value : 5;
}

function cleanup(now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

async function getRequestFingerprint(scope: string) {
  const headerStore = await headers();
  const forwardedFor = headerStore
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = headerStore.get("x-real-ip")?.trim();
  const userAgent = headerStore.get("user-agent")?.trim() ?? "unknown-agent";

  return `${scope}:${forwardedFor || realIp || "unknown-ip"}:${userAgent}`;
}

export async function getAuthRateLimitState(scope: "login" | "signup") {
  const now = Date.now();
  cleanup(now);

  const key = await getRequestFingerprint(`auth:${scope}`);
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    return {
      key,
      allowed: true,
      remaining: getMaxAttempts(),
      retryAfterSeconds: 0,
    };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((current.resetAt - now) / 1000),
  );

  return {
    key,
    allowed: current.count < getMaxAttempts(),
    remaining: Math.max(getMaxAttempts() - current.count, 0),
    retryAfterSeconds,
  };
}

export function registerAuthFailure(key: string) {
  const now = Date.now();
  const current = store.get(key);
  const windowMs = getWindowMs();

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  current.count += 1;
  store.set(key, current);
}

export function clearAuthFailures(key: string) {
  store.delete(key);
}

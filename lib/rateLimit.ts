import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Rate limiting protects registration/OTP/login endpoints from brute-force and
// abuse. In production it must be configured; failing fast on a missing
// Upstash config beats silently shipping an unprotected deployment.
if (!hasUpstash) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN are required in production — rate limiting cannot be disabled. See DEPLOYMENT.md."
    );
  }
  console.warn(
    "[rateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting is DISABLED (allowed outside production only)."
  );
}

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const limiters = {
  register: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h") }) : null,
  login: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 m") }) : null,
  otp: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 m") }) : null,
};

export async function rateLimit(kind: keyof typeof limiters, key: string) {
  const limiter = limiters[kind];
  if (!limiter) return { success: true }; // not configured — allow (dev/test only)
  return limiter.limit(key);
}

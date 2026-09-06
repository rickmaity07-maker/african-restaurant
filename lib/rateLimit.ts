import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// If Upstash env vars aren't set (e.g. local dev), limiting is skipped instead of crashing.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiters = {
  register: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h") }) : null,
  login: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 m") }) : null,
  otp: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 m") }) : null,
};

export async function rateLimit(kind: keyof typeof limiters, key: string) {
  const limiter = limiters[kind];
  if (!limiter) return { success: true }; // not configured — allow
  return limiter.limit(key);
}

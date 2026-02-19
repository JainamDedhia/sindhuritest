// lib/ratelimit.ts
// Sliding window rate limiting via Upstash Redis.
// Different limits apply depending on route sensitivity.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Shared Redis client (reused across all limiters)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ─────────────────────────────────────────────────────────
// RATE LIMIT TIERS
// Sliding window = fairer than fixed window under burst traffic
// ─────────────────────────────────────────────────────────

/**
 * AUTH routes — strictest limit
 * Protects login/register from brute force & credential stuffing.
 * 5 requests per 1 minute per IP
 */
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "rl:auth",
});

/**
 * MUTATION routes — strict limit
 * Covers cart, wishlist, profile updates, checkout.
 * 30 requests per 1 minute per IP
 */
export const mutationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "rl:mutation",
});

/**
 * GENERAL API routes — permissive limit
 * Covers product listings, search, public data.
 * 100 requests per 1 minute per IP
 */
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "rl:general",
});

// ─────────────────────────────────────────────────────────
// ROUTE → LIMITER MAPPING
// Returns the correct limiter based on the request pathname.
// ─────────────────────────────────────────────────────────

export type LimiterResult = Awaited<ReturnType<typeof generalLimiter.limit>>;

export function getLimiterForPath(pathname: string): typeof generalLimiter {
  // Auth routes — brute force protection
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register")
  ) {
    return authLimiter;
  }

  // Mutation routes — write operations
  if (
    pathname.startsWith("/api/cart") ||
    pathname.startsWith("/api/wishlist") ||
    pathname.startsWith("/api/profile") ||
    pathname.startsWith("/api/checkout") ||
    pathname.startsWith("/api/orders")
  ) {
    return mutationLimiter;
  }

  // Everything else — general API
  return generalLimiter;
}
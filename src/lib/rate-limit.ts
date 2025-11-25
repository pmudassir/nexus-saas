'use server';

/**
 * Rate limiting using in-memory store (production should use Redis/Upstash)
 * This provides basic protection against abuse
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number; // Max requests allowed
  windowMs: number; // Time window in milliseconds
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60 * 1000 } // Default: 100 requests per minute
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Initialize or get existing rate limit data
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  const data = rateLimitStore[key];
  data.count++;

  const remaining = Math.max(0, config.maxRequests - data.count);
  const success = data.count <= config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: data.resetTime,
  };
}

/**
 * Rate limit middleware for API routes
 */
export async function checkRateLimit(
  identifier: string,
  config?: RateLimitConfig
): Promise<void> {
  const result = await rateLimit(identifier, config);

  if (!result.success) {
    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil(
        (result.reset - Date.now()) / 1000
      )} seconds.`
    );
  }
}

/**
 * Get rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}

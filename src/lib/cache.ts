/**
 * Cache utility for server-side data caching
 * Uses in-memory cache with TTL for development
 * In production, integrate with Redis or Vercel KV
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Default TTL: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Get cached data or execute the fetcher function
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  // Return cached data if valid
  if (entry && entry.expiresAt > now) {
    return entry.data;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  cache.set(key, {
    data,
    expiresAt: now + ttl,
  });

  return data;
}

/**
 * Invalidate specific cache key
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate cache keys matching a pattern
 */
export function invalidateCachePattern(pattern: string): void {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

// Clean up expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (entry.expiresAt < now) {
        cache.delete(key);
      }
    }
  }, 60 * 1000); // Every minute
}

/**
 * Cache decorators for common patterns
 */
export const CacheTTL = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  HOUR: 60 * 60 * 1000, // 1 hour
  DAY: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Cache key generators
 */
export function tenantCacheKey(tenantId: string, resource: string): string {
  return `tenant:${tenantId}:${resource}`;
}

export function userCacheKey(userId: string, resource: string): string {
  return `user:${userId}:${resource}`;
}

export function globalCacheKey(resource: string): string {
  return `global:${resource}`;
}

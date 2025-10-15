import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type CacheOptions = {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
};

/**
 * Cache key prefixes for different data types
 */
export const CACHE_PREFIXES = {
  USER: 'user',
  WORKSPACE: 'workspace',
  SUBSCRIPTION: 'subscription',
  AI_RESPONSE: 'ai',
  IMAGE: 'image',
  PRODUCT: 'product',
  PAGE: 'page',
  API: 'api',
} as const;

/**
 * Default TTL values for different cache types (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
  MONTH: 2592000, // 30 days
} as const;

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set value in cache
 */
export async function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<void> {
  try {
    const { ttl = CACHE_TTL.MEDIUM, tags = [] } = options;

    // Set the main cache value
    if (ttl > 0) {
      await redis.setex(key, ttl, JSON.stringify(value));
    } else {
      await redis.set(key, JSON.stringify(value));
    }

    // Store tags for invalidation
    if (tags.length > 0) {
      await Promise.all(
        tags.map((tag) =>
          redis.sadd(`cache:tag:${tag}`, key)
        )
      );
    }
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error);
  }
}

/**
 * Invalidate cache by tags
 */
export async function invalidateCacheByTags(tags: string[]): Promise<void> {
  try {
    for (const tag of tags) {
      const keys = await redis.smembers<string>(`cache:tag:${tag}`);

      if (keys && keys.length > 0) {
        // Delete all keys with this tag
        await Promise.all(keys.map((key) => redis.del(key)));

        // Delete the tag set
        await redis.del(`cache:tag:${tag}`);
      }
    }
  } catch (error) {
    console.error(`Cache invalidation error for tags ${tags}:`, error);
  }
}

/**
 * Cache wrapper with automatic get/set
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache
  const cached = await getCache<T>(key);

  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  await setCache(key, data, options);

  return data;
}

/**
 * Generate cache key with prefix
 */
export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}

/**
 * Cache implementation for user data
 */
export const userCache = {
  get: (userId: string) =>
    getCache<any>(cacheKey(CACHE_PREFIXES.USER, userId)),

  set: (userId: string, data: any) =>
    setCache(cacheKey(CACHE_PREFIXES.USER, userId), data, {
      ttl: CACHE_TTL.MEDIUM,
      tags: ['user', `user:${userId}`],
    }),

  delete: (userId: string) =>
    deleteCache(cacheKey(CACHE_PREFIXES.USER, userId)),

  invalidate: (userId: string) =>
    invalidateCacheByTags([`user:${userId}`]),
};

/**
 * Cache implementation for workspace data
 */
export const workspaceCache = {
  get: (workspaceId: string) =>
    getCache<any>(cacheKey(CACHE_PREFIXES.WORKSPACE, workspaceId)),

  set: (workspaceId: string, data: any) =>
    setCache(cacheKey(CACHE_PREFIXES.WORKSPACE, workspaceId), data, {
      ttl: CACHE_TTL.MEDIUM,
      tags: ['workspace', `workspace:${workspaceId}`],
    }),

  delete: (workspaceId: string) =>
    deleteCache(cacheKey(CACHE_PREFIXES.WORKSPACE, workspaceId)),

  invalidate: (workspaceId: string) =>
    invalidateCacheByTags([`workspace:${workspaceId}`]),
};

/**
 * Cache implementation for subscription data
 */
export const subscriptionCache = {
  get: (workspaceId: string) =>
    getCache<any>(cacheKey(CACHE_PREFIXES.SUBSCRIPTION, workspaceId)),

  set: (workspaceId: string, data: any) =>
    setCache(cacheKey(CACHE_PREFIXES.SUBSCRIPTION, workspaceId), data, {
      ttl: CACHE_TTL.LONG,
      tags: ['subscription', `workspace:${workspaceId}`],
    }),

  delete: (workspaceId: string) =>
    deleteCache(cacheKey(CACHE_PREFIXES.SUBSCRIPTION, workspaceId)),

  invalidate: (workspaceId: string) =>
    invalidateCacheByTags([`workspace:${workspaceId}`]),
};

/**
 * Cache implementation for AI responses
 */
export const aiCache = {
  get: (prompt: string, model: string) =>
    getCache<any>(cacheKey(CACHE_PREFIXES.AI_RESPONSE, model, prompt)),

  set: (prompt: string, model: string, data: any) =>
    setCache(cacheKey(CACHE_PREFIXES.AI_RESPONSE, model, prompt), data, {
      ttl: CACHE_TTL.DAY,
      tags: ['ai'],
    }),

  delete: (prompt: string, model: string) =>
    deleteCache(cacheKey(CACHE_PREFIXES.AI_RESPONSE, model, prompt)),
};

/**
 * Cache implementation for API responses
 */
export const apiCache = {
  get: (endpoint: string, params: string) =>
    getCache<any>(cacheKey(CACHE_PREFIXES.API, endpoint, params)),

  set: (endpoint: string, params: string, data: any, ttl: number = CACHE_TTL.SHORT) =>
    setCache(cacheKey(CACHE_PREFIXES.API, endpoint, params), data, {
      ttl,
      tags: ['api', endpoint],
    }),

  delete: (endpoint: string, params: string) =>
    deleteCache(cacheKey(CACHE_PREFIXES.API, endpoint, params)),

  invalidate: (endpoint: string) =>
    invalidateCacheByTags([endpoint]),
};

/**
 * Flush all cache
 */
export async function flushCache(): Promise<void> {
  try {
    await redis.flushdb();
  } catch (error) {
    console.error('Cache flush error:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  keys: number;
  memory: string;
  hits: number;
  misses: number;
}> {
  try {
    const info = await redis.info();
    // Parse Redis INFO response
    // This is a simplified version, actual implementation would parse the response
    return {
      keys: 0,
      memory: '0MB',
      hits: 0,
      misses: 0,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return {
      keys: 0,
      memory: '0MB',
      hits: 0,
      misses: 0,
    };
  }
}

/**
 * Warming cache with frequently accessed data
 */
export async function warmCache(workspaceId: string): Promise<void> {
  // This would fetch and cache frequently accessed data
  // Implementation depends on specific use case
  console.log(`Warming cache for workspace ${workspaceId}`);
}

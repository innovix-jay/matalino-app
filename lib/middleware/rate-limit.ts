import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limit configurations
export const rateLimiters = {
  // Strict limit for authentication endpoints
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
    analytics: true,
    prefix: 'ratelimit:auth',
  }),

  // API endpoints
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
    prefix: 'ratelimit:api',
  }),

  // AI generation endpoints (expensive operations)
  aiGeneration: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
    prefix: 'ratelimit:ai',
  }),

  // Image generation (very expensive)
  imageGeneration: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    analytics: true,
    prefix: 'ratelimit:image',
  }),

  // File uploads
  fileUpload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 uploads per minute
    analytics: true,
    prefix: 'ratelimit:upload',
  }),

  // Webhook endpoints
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 m'), // 1000 requests per minute
    analytics: true,
    prefix: 'ratelimit:webhook',
  }),

  // General page views
  page: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
    analytics: true,
    prefix: 'ratelimit:page',
  }),
};

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(request: NextRequest): string {
  // Try to get user ID from session/cookie
  const userId = request.cookies.get('user_id')?.value;
  if (userId) return `user:${userId}`;

  // Fall back to IP address
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  return `ip:${ip}`;
}

/**
 * Check rate limit and return response if exceeded
 */
export async function checkRateLimit(
  request: NextRequest,
  limiter: Ratelimit
): Promise<NextResponse | null> {
  const identifier = getRateLimitIdentifier(request);

  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  // Add rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers,
      }
    );
  }

  return null;
}

/**
 * Rate limit decorator for API routes
 */
export function withRateLimit(limiter: Ratelimit) {
  return function (
    handler: (request: NextRequest) => Promise<NextResponse>
  ) {
    return async (request: NextRequest): Promise<NextResponse> => {
      const rateLimitResponse = await checkRateLimit(request, limiter);

      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      return handler(request);
    };
  };
}

/**
 * Custom rate limiter for specific use cases
 */
export async function createCustomRateLimit(
  identifier: string,
  limit: number,
  window: string
): Promise<boolean> {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `ratelimit:custom:${identifier}`,
  });

  const { success } = await limiter.limit(identifier);
  return success;
}

/**
 * Reset rate limit for a specific identifier
 */
export async function resetRateLimit(
  prefix: string,
  identifier: string
): Promise<void> {
  await redis.del(`${prefix}:${identifier}`);
}

/**
 * Get rate limit analytics
 */
export async function getRateLimitStats(
  prefix: string,
  timeRange: '1h' | '24h' | '7d' = '24h'
): Promise<{
  totalRequests: number;
  blockedRequests: number;
  uniqueIdentifiers: number;
}> {
  // This would require implementing analytics tracking
  // For now, return placeholder data
  return {
    totalRequests: 0,
    blockedRequests: 0,
    uniqueIdentifiers: 0,
  };
}

/**
 * IP-based blocking for malicious actors
 */
const blockedIPs = new Set<string>();

export async function isIPBlocked(ip: string): Promise<boolean> {
  return blockedIPs.has(ip);
}

export async function blockIP(ip: string, duration: number = 3600): Promise<void> {
  blockedIPs.add(ip);
  await redis.setex(`blocked:ip:${ip}`, duration, '1');

  // Auto-remove after duration
  setTimeout(() => {
    blockedIPs.delete(ip);
  }, duration * 1000);
}

export async function unblockIP(ip: string): Promise<void> {
  blockedIPs.delete(ip);
  await redis.del(`blocked:ip:${ip}`);
}

/**
 * Load blocked IPs from Redis on startup
 */
export async function loadBlockedIPs(): Promise<void> {
  const keys = await redis.keys('blocked:ip:*');

  for (const key of keys) {
    const ip = key.replace('blocked:ip:', '');
    blockedIPs.add(ip);
  }
}

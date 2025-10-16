import { headers } from 'next/headers'

// Simple in-memory rate limiter for production
// For production scale, use Redis/Upstash
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  interval: number // milliseconds
  uniqueTokenPerInterval: number // max requests per interval
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  }
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now()
  const key = `rate-limit:${identifier}`
  
  const record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.interval,
    })
    
    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - 1,
      reset: now + config.interval,
    }
  }
  
  if (record.count >= config.uniqueTokenPerInterval) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.uniqueTokenPerInterval,
      remaining: 0,
      reset: record.resetTime,
    }
  }
  
  // Increment count
  record.count++
  rateLimitMap.set(key, record)
  
  return {
    success: true,
    limit: config.uniqueTokenPerInterval,
    remaining: config.uniqueTokenPerInterval - record.count,
    reset: record.resetTime,
  }
}

// Helper to get client IP
export async function getClientIdentifier(): Promise<string> {
  const headersList = headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  
  return forwardedFor?.split(',')[0] || realIp || 'anonymous'
}

// Cleanup old entries periodically (run this in a cron if needed)
export function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}


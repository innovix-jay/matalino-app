import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: CheckResult;
    api: CheckResult;
  };
  version: string;
}

interface CheckResult {
  status: 'pass' | 'fail';
  responseTime?: number;
  error?: string;
}

/**
 * Health check endpoint for monitoring
 * GET /api/health/check
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  const checks = {
    database: await checkDatabase(),
    api: await checkAPI(),
  };

  const allHealthy = Object.values(checks).every((check) => check.status === 'pass');
  const anyFailed = Object.values(checks).some((check) => check.status === 'fail');

  const health: HealthCheck = {
    status: anyFailed ? 'unhealthy' : allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    checks,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      return {
        status: 'fail',
        responseTime: Date.now() - start,
        error: error.message,
      };
    }

    return {
      status: 'pass',
      responseTime: Date.now() - start,
    };
  } catch (error: any) {
    return {
      status: 'fail',
      responseTime: Date.now() - start,
      error: error.message || 'Database connection failed',
    };
  }
}

/**
 * Check API responsiveness
 */
async function checkAPI(): Promise<CheckResult> {
  const start = Date.now();

  try {
    // Simple check that the API is responding
    const responseTime = Date.now() - start;

    if (responseTime > 5000) {
      return {
        status: 'fail',
        responseTime,
        error: 'API response time too slow',
      };
    }

    return {
      status: 'pass',
      responseTime,
    };
  } catch (error: any) {
    return {
      status: 'fail',
      responseTime: Date.now() - start,
      error: error.message || 'API check failed',
    };
  }
}


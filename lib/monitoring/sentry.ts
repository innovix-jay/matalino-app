import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENV || 'development';

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,

    // Performance Monitoring
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/matalino\.app/,
          /^https:\/\/.*\.vercel\.app/,
        ],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove any PII from event data
      if (event.request) {
        delete event.request.cookies;

        // Remove sensitive headers
        if (event.request.headers) {
          delete event.request.headers.Authorization;
          delete event.request.headers['X-API-Key'];
        }
      }

      // Remove query parameters that might contain sensitive data
      if (event.request?.url) {
        const url = new URL(event.request.url);
        url.search = '';
        event.request.url = url.toString();
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extension errors
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',

      // Network errors
      'NetworkError',
      'Failed to fetch',
      'Load failed',

      // Chunk loading errors (usually just user navigating away)
      'ChunkLoadError',
      'Loading chunk',
    ],
  });
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: {
    user?: { id: string; email: string; username?: string };
    workspace?: { id: string; name: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser({
        id: context.user.id,
        email: context.user.email,
        username: context.user.username,
      });
    }

    if (context?.workspace) {
      scope.setContext('workspace', context.workspace);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture message for logging
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info',
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureMessage(message, level);
  });
}

/**
 * Start a transaction for performance monitoring
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op });
}

/**
 * Set user context for current scope
 */
export function setUser(user: { id: string; email: string; username?: string } | null) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  category: string,
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Performance monitoring wrapper for async functions
 */
export async function withTransaction<T>(
  name: string,
  op: string,
  fn: (transaction: ReturnType<typeof startTransaction>) => Promise<T>
): Promise<T> {
  const transaction = startTransaction(name, op);

  try {
    const result = await fn(transaction);
    transaction.setStatus('ok');
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
}

/**
 * Middleware helper for API routes
 */
export function withSentryServerSide<T>(
  handler: (req: any, res: any) => Promise<T>
) {
  return async (req: any, res: any): Promise<T> => {
    const transaction = startTransaction(
      `${req.method} ${req.url}`,
      'http.server'
    );

    try {
      const result = await handler(req, res);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      captureException(error as Error, {
        tags: {
          method: req.method,
          url: req.url,
        },
        extra: {
          query: req.query,
          body: req.body,
        },
      });
      throw error;
    } finally {
      transaction.finish();
    }
  };
}

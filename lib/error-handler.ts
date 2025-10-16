/**
 * Production-ready error handler
 * Logs errors and returns safe messages to clients
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown): {
  message: string
  statusCode: number
  code?: string
} {
  // Log error for debugging (in production, send to monitoring service)
  console.error('[ERROR]', error)

  // Handle known AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    }
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string }
    
    // Map common Supabase error codes
    switch (supabaseError.code) {
      case '23505': // Unique violation
        return {
          message: 'This item already exists',
          statusCode: 409,
          code: 'DUPLICATE_ENTRY',
        }
      case '23503': // Foreign key violation
        return {
          message: 'Referenced item does not exist',
          statusCode: 400,
          code: 'INVALID_REFERENCE',
        }
      case 'PGRST116': // No rows returned
        return {
          message: 'Item not found',
          statusCode: 404,
          code: 'NOT_FOUND',
        }
      default:
        return {
          message: 'Database error occurred',
          statusCode: 500,
          code: supabaseError.code,
        }
    }
  }

  // Handle Stripe errors
  if (error && typeof error === 'object' && 'type' in error) {
    const stripeError = error as { type: string; message: string }
    
    if (stripeError.type === 'StripeCardError') {
      return {
        message: stripeError.message || 'Card error',
        statusCode: 400,
        code: 'CARD_ERROR',
      }
    }
    
    if (stripeError.type === 'StripeInvalidRequestError') {
      return {
        message: 'Invalid payment request',
        statusCode: 400,
        code: 'INVALID_PAYMENT',
      }
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Don't expose internal error details in production
    const isDev = process.env.NODE_ENV === 'development'
    
    return {
      message: isDev ? error.message : 'An unexpected error occurred',
      statusCode: 500,
      code: 'INTERNAL_ERROR',
    }
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
  }
}

/**
 * Wrapper for async API routes with error handling
 */
export function withErrorHandler<T>(
  handler: () => Promise<T>
): Promise<T | { error: string; code?: string }> {
  return handler().catch((error) => {
    const handled = handleError(error)
    return {
      error: handled.message,
      code: handled.code,
    }
  })
}


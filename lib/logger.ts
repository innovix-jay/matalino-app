/**
 * Production-ready logging utility
 * In production, integrate with services like Sentry, LogRocket, or DataDog
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context))
    
    // In production, send to monitoring service
    if (this.isProduction) {
      this.sendToMonitoring('warn', message, context)
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }

    console.error(this.formatMessage('error', message, errorContext))
    
    // In production, send to monitoring service
    if (this.isProduction) {
      this.sendToMonitoring('error', message, errorContext)
    }
  }

  private sendToMonitoring(level: LogLevel, message: string, context?: LogContext) {
    // TODO: Integrate with Sentry, LogRocket, or other monitoring service
    // Example with Sentry:
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureMessage(message, {
    //     level: level as SeverityLevel,
    //     extra: context,
    //   })
    // }
  }

  // Track user actions for analytics
  trackEvent(eventName: string, properties?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.log(`[TRACK] ${eventName}`, properties)
    }

    // In production, send to analytics service
    if (this.isProduction) {
      // TODO: Integrate with PostHog, Mixpanel, or Google Analytics
      // Example with PostHog:
      // if (typeof window !== 'undefined' && window.posthog) {
      //   window.posthog.capture(eventName, properties)
      // }
    }
  }
}

export const logger = new Logger()


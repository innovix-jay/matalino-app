/**
 * Get the application URL for the current environment
 * 
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (production/staging custom domain)
 * 2. VERCEL_URL (Vercel preview deployments)
 * 3. window.location.origin (client-side fallback)
 * 4. localhost (development fallback)
 */
export function getAppUrl(): string {
  // Server-side
  if (typeof window === 'undefined') {
    // Use explicit APP_URL if set
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }
    
    // Use Vercel URL for preview deployments
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    
    // Development fallback
    return 'http://localhost:3000'
  }
  
  // Client-side
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  return window.location.origin
}

/**
 * Get the auth callback URL
 */
export function getAuthCallbackUrl(): string {
  return `${getAppUrl()}/auth/callback`
}

/**
 * Get the dashboard URL
 */
export function getDashboardUrl(): string {
  return `${getAppUrl()}/dashboard`
}

/**
 * Check if we're in production (using custom domain)
 */
export function isProduction(): boolean {
  const url = getAppUrl()
  return url.includes('matalino.online')
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

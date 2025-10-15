import posthog from 'posthog-js';

let isInitialized = false;

export function initPostHog() {
  if (typeof window === 'undefined' || isInitialized) return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    console.warn('PostHog API key not configured. Analytics disabled.');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.opt_out_capturing();
      }
    },
    capture_pageview: false, // We'll manually capture pageviews
    capture_pageleave: true,
    autocapture: {
      dom_event_allowlist: ['click', 'submit'],
      element_allowlist: ['button', 'a'],
    },
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-private]',
    },
  });

  isInitialized = true;
}

/**
 * Identify user
 */
export function identifyUser(
  userId: string,
  properties?: {
    email?: string;
    name?: string;
    username?: string;
    workspace_id?: string;
    subscription_tier?: string;
    [key: string]: any;
  }
) {
  if (!isInitialized) return;

  posthog.identify(userId, properties);
}

/**
 * Track event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (!isInitialized) return;

  posthog.capture(eventName, properties);
}

/**
 * Track page view
 */
export function trackPageView(
  path: string,
  properties?: Record<string, any>
) {
  if (!isInitialized) return;

  posthog.capture('$pageview', {
    $current_url: path,
    ...properties,
  });
}

/**
 * Reset user session (on logout)
 */
export function resetUser() {
  if (!isInitialized) return;

  posthog.reset();
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!isInitialized) return;

  posthog.people.set(properties);
}

/**
 * Feature flags
 */
export function isFeatureEnabled(featureName: string): boolean {
  if (!isInitialized) return false;

  return posthog.isFeatureEnabled(featureName) || false;
}

export function getFeatureFlag(featureName: string): string | boolean | undefined {
  if (!isInitialized) return undefined;

  return posthog.getFeatureFlag(featureName);
}

// Pre-defined analytics events
export const AnalyticsEvents = {
  // Authentication
  SIGN_UP: 'user_signed_up',
  SIGN_IN: 'user_signed_in',
  SIGN_OUT: 'user_signed_out',

  // Subscription
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  TRIAL_STARTED: 'trial_started',
  TRIAL_CONVERTED: 'trial_converted',

  // AI Features
  AI_MESSAGE_SENT: 'ai_message_sent',
  AI_IMAGE_GENERATED: 'ai_image_generated',
  AI_CONTENT_GENERATED: 'ai_content_generated',

  // Product Management
  PRODUCT_CREATED: 'product_created',
  PRODUCT_PUBLISHED: 'product_published',
  PRODUCT_DELETED: 'product_deleted',

  // Sales
  SALE_COMPLETED: 'sale_completed',
  PAYMENT_FAILED: 'payment_failed',

  // Engagement
  WORKSPACE_CREATED: 'workspace_created',
  TEAM_MEMBER_INVITED: 'team_member_invited',
  EMAIL_CAMPAIGN_SENT: 'email_campaign_sent',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

/**
 * Track business metrics
 */
export function trackBusinessMetric(
  metricName: string,
  value: number,
  properties?: Record<string, any>
) {
  trackEvent(`metric_${metricName}`, {
    value,
    ...properties,
  });
}

/**
 * Track conversion funnel step
 */
export function trackFunnelStep(
  funnelName: string,
  stepName: string,
  properties?: Record<string, any>
) {
  trackEvent(`funnel_${funnelName}_${stepName}`, properties);
}

/**
 * Group analytics (for workspaces)
 */
export function setGroup(
  groupType: 'workspace',
  groupId: string,
  properties?: Record<string, any>
) {
  if (!isInitialized) return;

  posthog.group(groupType, groupId, properties);
}

export { posthog };

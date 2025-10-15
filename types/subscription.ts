// Subscription Tiers
export type SubscriptionTierId = 'free' | 'pro' | 'business';

export type BillingCycle = 'monthly' | 'yearly';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  display_name: string;
  description: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  stripe_monthly_price_id: string | null;
  stripe_yearly_price_id: string | null;

  // Limits
  max_storefronts: number;
  max_products: number;
  max_email_subscribers: number;
  max_team_members: number;
  max_ai_messages_per_day: number;
  max_ai_images_per_day: number;

  // Features
  custom_domain: boolean;
  email_automation: boolean;
  priority_support: boolean;
  remove_branding: boolean;
  white_label: boolean;
  api_access: boolean;

  features: string[];
  position: number;
  is_active: boolean;
}

export interface WorkspaceSubscription {
  id: string;
  workspace_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;

  tier_id: SubscriptionTierId;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;

  trial_ends_at: string | null;
  trial_started_at: string | null;

  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;

  cancellation_reason: string | null;
  cancellation_feedback: string | null;

  created_at: string;
  updated_at: string;
}

export interface WorkspaceSubscriptionWithTier extends WorkspaceSubscription {
  tier: SubscriptionTier;
}

export interface WorkspaceDailyUsage {
  id: string;
  workspace_id: string;
  date: string;

  products_count: number;
  email_subscribers_count: number;
  team_members_count: number;
  ai_messages_count: number;
  ai_images_count: number;

  storage_used_bytes: number;
  bandwidth_used_bytes: number;

  sales_revenue_cents: number;
  platform_fee_cents: number;

  created_at: string;
  updated_at: string;
}

export interface SubscriptionAddon {
  id: string;
  workspace_subscription_id: string;
  addon_type: 'extra_team_member' | 'extra_subscribers' | 'ai_credit_pack';
  quantity: number;
  price_cents: number;
  stripe_price_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  workspace_id: string;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  amount_cents: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  description: string | null;
  invoice_url: string | null;
  receipt_url: string | null;
  payment_method_type: string | null;
  payment_method_last4: string | null;
  failed_reason: string | null;
  failed_at: string | null;
  created_at: string;
}

export interface SubscriptionMetrics {
  date: string;
  mrr_cents: number;
  arr_cents: number;
  total_customers: number;
  new_customers: number;
  churned_customers: number;
  free_tier_count: number;
  pro_tier_count: number;
  business_tier_count: number;
  churn_rate: number;
  arpu_cents: number;
}

// Usage Limits Check
export interface UsageLimits {
  products: {
    used: number;
    limit: number;
    percentage: number;
    canCreate: boolean;
  };
  email_subscribers: {
    used: number;
    limit: number;
    percentage: number;
    canCreate: boolean;
  };
  team_members: {
    used: number;
    limit: number;
    percentage: number;
    canAdd: boolean;
  };
  ai_messages_today: {
    used: number;
    limit: number;
    percentage: number;
    remaining: number;
    canSend: boolean;
  };
  ai_images_today: {
    used: number;
    limit: number;
    percentage: number;
    remaining: number;
    canGenerate: boolean;
  };
}

// Billing Summary
export interface BillingSummary {
  subscription: WorkspaceSubscriptionWithTier;
  usage: WorkspaceDailyUsage;
  limits: UsageLimits;
  next_billing_date: string | null;
  next_billing_amount_cents: number;
  is_trial: boolean;
  trial_days_remaining: number | null;
  payment_method: {
    type: string;
    last4: string;
  } | null;
}

// Upgrade/Downgrade Options
export interface UpgradeOption {
  tier: SubscriptionTier;
  billing_cycle: BillingCycle;
  price_cents: number;
  proration_amount_cents: number;
  immediate_charge_cents: number;
  savings_vs_monthly: number; // for yearly
}

// Revenue Analytics
export interface RevenueAnalytics {
  // Overview
  mrr: number;
  arr: number;
  total_revenue_this_month: number;
  total_revenue_last_month: number;
  revenue_growth_percentage: number;

  // Customer metrics
  total_active_subscriptions: number;
  new_subscriptions_this_month: number;
  churned_subscriptions_this_month: number;
  churn_rate: number;

  // Per-tier breakdown
  tier_breakdown: {
    tier_id: SubscriptionTierId;
    tier_name: string;
    customer_count: number;
    mrr_cents: number;
    percentage_of_mrr: number;
  }[];

  // Lifetime value
  average_ltv_cents: number;
  average_subscription_length_months: number;

  // ARPU
  arpu_cents: number;

  // Trends (last 12 months)
  monthly_trends: {
    month: string;
    mrr_cents: number;
    new_customers: number;
    churned_customers: number;
    net_customers: number;
  }[];
}

// Stripe Webhook Event Types
export type StripeWebhookEvent =
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'customer.subscription.trial_will_end'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'invoice.payment_action_required'
  | 'customer.created'
  | 'customer.updated'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed';

// Feature Gate Check Result
export interface FeatureGateResult {
  allowed: boolean;
  reason?: string;
  upgrade_required?: {
    feature: string;
    required_tier: SubscriptionTierId;
    current_tier: SubscriptionTierId;
  };
}

import Stripe from 'stripe';
import { SubscriptionTierId, BillingCycle } from '@/types/subscription';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Stripe Price IDs (set these from your Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  },
  business: {
    monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID!,
  },
} as const;

// Platform fee percentage (5% on all sales)
export const PLATFORM_FEE_PERCENTAGE = 0.05;

/**
 * Create a Stripe Customer for a workspace
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  workspaceId: string;
}): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      workspace_id: params.workspaceId,
    },
  });
}

/**
 * Create a Checkout Session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  workspaceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: {
        workspace_id: params.workspaceId,
      },
    },
    metadata: {
      workspace_id: params.workspaceId,
    },
  };

  // Add trial if specified
  if (params.trialDays && params.trialDays > 0) {
    sessionParams.subscription_data!.trial_period_days = params.trialDays;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Create a Customer Portal Session
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

/**
 * Update subscription (upgrade/downgrade)
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  newPriceId: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);

  return stripe.subscriptions.update(params.subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: params.newPriceId,
      },
    ],
    proration_behavior: params.prorationBehavior || 'create_prorations',
  });
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(params: {
  subscriptionId: string;
  immediately?: boolean;
  cancellationReason?: string;
}): Promise<Stripe.Subscription> {
  if (params.immediately) {
    return stripe.subscriptions.cancel(params.subscriptionId);
  }

  return stripe.subscriptions.update(params.subscriptionId, {
    cancel_at_period_end: true,
    cancellation_details: params.cancellationReason
      ? {
          comment: params.cancellationReason,
        }
      : undefined,
  });
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Calculate proration amount for upgrade/downgrade
 */
export async function calculateProration(params: {
  subscriptionId: string;
  newPriceId: string;
}): Promise<{
  proratedAmount: number;
  immediateCharge: number;
  nextInvoiceAmount: number;
}> {
  const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);

  // Create upcoming invoice with proration
  const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
    customer: subscription.customer as string,
    subscription: params.subscriptionId,
    subscription_items: [
      {
        id: subscription.items.data[0].id,
        price: params.newPriceId,
      },
    ],
    subscription_proration_behavior: 'create_prorations',
  });

  // Calculate proration amount (can be positive or negative)
  let proratedAmount = 0;
  let immediateCharge = 0;

  upcomingInvoice.lines.data.forEach((line) => {
    if (line.proration) {
      proratedAmount += line.amount;
    }
  });

  // If upgrading, there might be an immediate charge
  if (upcomingInvoice.amount_due > 0) {
    immediateCharge = upcomingInvoice.amount_due;
  }

  return {
    proratedAmount,
    immediateCharge,
    nextInvoiceAmount: upcomingInvoice.amount_remaining,
  };
}

/**
 * Retrieve subscription details
 */
export async function getSubscriptionDetails(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method', 'latest_invoice'],
  });
}

/**
 * Get customer payment methods
 */
export async function getCustomerPaymentMethods(
  customerId: string
): Promise<Stripe.PaymentMethod[]> {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

/**
 * Send invoice for failed payment
 */
export async function sendInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.sendInvoice(invoiceId);
}

/**
 * Get price by tier and cycle
 */
export function getPriceId(tier: SubscriptionTierId, cycle: BillingCycle): string | null {
  if (tier === 'free') return null;

  const prices = STRIPE_PRICE_IDS[tier];
  return prices[cycle];
}

/**
 * Get tier and cycle from price ID
 */
export function getTierFromPriceId(priceId: string): {
  tier: SubscriptionTierId;
  cycle: BillingCycle;
} | null {
  for (const [tier, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (prices.monthly === priceId) {
      return { tier: tier as SubscriptionTierId, cycle: 'monthly' };
    }
    if (prices.yearly === priceId) {
      return { tier: tier as SubscriptionTierId, cycle: 'yearly' };
    }
  }
  return null;
}

/**
 * Calculate platform fee for a sale
 */
export function calculatePlatformFee(saleAmountCents: number): number {
  return Math.round(saleAmountCents * PLATFORM_FEE_PERCENTAGE);
}

/**
 * Create a transfer to connected account (for marketplace)
 */
export async function createTransfer(params: {
  amount: number;
  currency: string;
  destination: string;
  sourceTransaction: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Transfer> {
  return stripe.transfers.create({
    amount: params.amount,
    currency: params.currency,
    destination: params.destination,
    source_transaction: params.sourceTransaction,
    metadata: params.metadata,
  });
}

/**
 * Webhook signature verification
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

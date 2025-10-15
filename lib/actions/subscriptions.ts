'use server';

import { createServerAction } from '@/lib/api/server-action';
import { z } from 'zod';
import {
  createStripeCustomer,
  createCheckoutSession,
  createPortalSession,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  calculateProration,
  getPriceId,
} from '@/lib/stripe/subscription-config';
import {
  WorkspaceSubscription,
  SubscriptionTierId,
  BillingCycle,
  UsageLimits,
  BillingSummary,
  UpgradeOption,
} from '@/types/subscription';

// ===== Schemas =====

const createCheckoutSchema = z.object({
  tierId: z.enum(['pro', 'business']),
  billingCycle: z.enum(['monthly', 'yearly']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const upgradeDowngradeSchema = z.object({
  tierId: z.enum(['free', 'pro', 'business']),
  billingCycle: z.enum(['monthly', 'yearly']).optional(),
});

const cancelSubscriptionSchema = z.object({
  immediately: z.boolean().default(false),
  reason: z.string().optional(),
  feedback: z.string().max(1000).optional(),
});

// ===== Actions =====

/**
 * Create Stripe Checkout session for subscription
 */
export const createSubscriptionCheckout = createServerAction<
  z.infer<typeof createCheckoutSchema>,
  { url: string }
>({
  schema: createCheckoutSchema,
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 10 },
  action: async ({ input, userId, workspaceId, supabase }) => {
    // Get workspace details
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name, owner_id')
      .eq('id', workspaceId)
      .single();

    if (!workspace) throw new Error('Workspace not found');
    if (workspace.owner_id !== userId) throw new Error('Only workspace owner can manage subscription');

    // Get user email
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not found');

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('workspace_subscriptions')
      .select('stripe_customer_id')
      .eq('workspace_id', workspaceId)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      const customer = await createStripeCustomer({
        email: user.user.email!,
        name: workspace.name,
        workspaceId,
      });
      customerId = customer.id;

      // Save customer ID
      await supabase.from('workspace_subscriptions').upsert({
        workspace_id: workspaceId,
        stripe_customer_id: customerId,
        tier_id: 'free',
        status: 'active',
      }, {
        onConflict: 'workspace_id'
      });
    }

    // Get price ID
    const priceId = getPriceId(input.tierId, input.billingCycle);
    if (!priceId) throw new Error('Invalid tier or billing cycle');

    // Create checkout session with trial for Pro tier
    const trialDays = input.tierId === 'pro' ? 14 : undefined;

    const session = await createCheckoutSession({
      customerId,
      priceId,
      workspaceId,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      trialDays,
    });

    return { url: session.url! };
  },
});

/**
 * Create Customer Portal session
 */
export const createBillingPortal = createServerAction<
  { returnUrl: string },
  { url: string }
>({
  schema: z.object({ returnUrl: z.string().url() }),
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 10 },
  action: async ({ input, userId, workspaceId, supabase }) => {
    // Get workspace subscription
    const { data: subscription } = await supabase
      .from('workspace_subscriptions')
      .select('stripe_customer_id, workspace_id!inner(owner_id)')
      .eq('workspace_id', workspaceId)
      .single();

    if (!subscription) throw new Error('No subscription found');
    if ((subscription.workspace_id as any).owner_id !== userId) {
      throw new Error('Only workspace owner can access billing portal');
    }

    if (!subscription.stripe_customer_id) {
      throw new Error('No Stripe customer found');
    }

    const session = await createPortalSession({
      customerId: subscription.stripe_customer_id,
      returnUrl: input.returnUrl,
    });

    return { url: session.url };
  },
});

/**
 * Upgrade or downgrade subscription
 */
export const changeSubscriptionTier = createServerAction<
  z.infer<typeof upgradeDowngradeSchema>,
  { success: boolean; message: string }
>({
  schema: upgradeDowngradeSchema,
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 5 },
  action: async ({ input, userId, workspaceId, supabase }) => {
    const { data: subscription } = await supabase
      .from('workspace_subscriptions')
      .select('*, workspace_id!inner(owner_id)')
      .eq('workspace_id', workspaceId)
      .single();

    if (!subscription) throw new Error('No subscription found');
    if ((subscription.workspace_id as any).owner_id !== userId) {
      throw new Error('Only workspace owner can change subscription');
    }

    // Downgrade to free
    if (input.tierId === 'free') {
      if (!subscription.stripe_subscription_id) {
        throw new Error('Already on free tier');
      }

      await cancelSubscription({
        subscriptionId: subscription.stripe_subscription_id,
        immediately: false,
      });

      return {
        success: true,
        message: 'Subscription will be canceled at the end of the billing period',
      };
    }

    // Upgrade/change paid tier
    const newPriceId = getPriceId(
      input.tierId,
      input.billingCycle || subscription.billing_cycle
    );

    if (!newPriceId) throw new Error('Invalid tier or billing cycle');

    if (!subscription.stripe_subscription_id) {
      throw new Error('No active subscription to modify');
    }

    await updateSubscription({
      subscriptionId: subscription.stripe_subscription_id,
      newPriceId,
      prorationBehavior: 'create_prorations',
    });

    return {
      success: true,
      message: `Subscription updated to ${input.tierId}. Changes will be reflected immediately with prorated charges.`,
    };
  },
});

/**
 * Cancel subscription
 */
export const cancelWorkspaceSubscription = createServerAction<
  z.infer<typeof cancelSubscriptionSchema>,
  { success: boolean; message: string }
>({
  schema: cancelSubscriptionSchema,
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 5 },
  action: async ({ input, userId, workspaceId, supabase }) => {
    const { data: subscription } = await supabase
      .from('workspace_subscriptions')
      .select('*, workspace_id!inner(owner_id)')
      .eq('workspace_id', workspaceId)
      .single();

    if (!subscription) throw new Error('No subscription found');
    if ((subscription.workspace_id as any).owner_id !== userId) {
      throw new Error('Only workspace owner can cancel subscription');
    }

    if (!subscription.stripe_subscription_id) {
      throw new Error('No active subscription to cancel');
    }

    await cancelSubscription({
      subscriptionId: subscription.stripe_subscription_id,
      immediately: input.immediately,
      cancellationReason: input.reason,
    });

    // Save cancellation feedback
    if (input.reason || input.feedback) {
      await supabase
        .from('workspace_subscriptions')
        .update({
          cancellation_reason: input.reason,
          cancellation_feedback: input.feedback,
        })
        .eq('workspace_id', workspaceId);
    }

    const message = input.immediately
      ? 'Subscription canceled immediately'
      : 'Subscription will be canceled at the end of the billing period';

    return { success: true, message };
  },
});

/**
 * Reactivate canceled subscription
 */
export const reactivateWorkspaceSubscription = createServerAction<
  void,
  { success: boolean; message: string }
>({
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 5 },
  action: async ({ userId, workspaceId, supabase }) => {
    const { data: subscription } = await supabase
      .from('workspace_subscriptions')
      .select('*, workspace_id!inner(owner_id)')
      .eq('workspace_id', workspaceId)
      .single();

    if (!subscription) throw new Error('No subscription found');
    if ((subscription.workspace_id as any).owner_id !== userId) {
      throw new Error('Only workspace owner can reactivate subscription');
    }

    if (!subscription.stripe_subscription_id) {
      throw new Error('No subscription to reactivate');
    }

    if (!subscription.cancel_at_period_end) {
      throw new Error('Subscription is not scheduled for cancellation');
    }

    await reactivateSubscription(subscription.stripe_subscription_id);

    return {
      success: true,
      message: 'Subscription reactivated successfully',
    };
  },
});

/**
 * Get current subscription details
 */
export const getSubscriptionDetails = createServerAction<void, BillingSummary | null>({
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ workspaceId, supabase }) => {
    // Get subscription with tier info
    const { data: subData } = await supabase.rpc('get_workspace_subscription', {
      p_workspace_id: workspaceId,
    });

    if (!subData || subData.length === 0) {
      return null;
    }

    const sub = subData[0];

    // Get today's usage
    const { data: usage } = await supabase
      .from('workspace_daily_usage')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    // Get workspace counts
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('products_count, email_subscribers_count, images_generated_count')
      .eq('id', workspaceId)
      .single();

    // Build usage limits
    const limits: UsageLimits = {
      products: {
        used: workspace?.products_count || 0,
        limit: sub.max_products,
        percentage: ((workspace?.products_count || 0) / sub.max_products) * 100,
        canCreate: (workspace?.products_count || 0) < sub.max_products,
      },
      email_subscribers: {
        used: workspace?.email_subscribers_count || 0,
        limit: sub.max_email_subscribers,
        percentage: ((workspace?.email_subscribers_count || 0) / sub.max_email_subscribers) * 100,
        canCreate: (workspace?.email_subscribers_count || 0) < sub.max_email_subscribers,
      },
      team_members: {
        used: usage?.team_members_count || 1,
        limit: sub.max_team_members,
        percentage: ((usage?.team_members_count || 1) / sub.max_team_members) * 100,
        canAdd: (usage?.team_members_count || 1) < sub.max_team_members,
      },
      ai_messages_today: {
        used: usage?.ai_messages_count || 0,
        limit: sub.max_ai_messages_per_day,
        percentage: ((usage?.ai_messages_count || 0) / sub.max_ai_messages_per_day) * 100,
        remaining: Math.max(0, sub.max_ai_messages_per_day - (usage?.ai_messages_count || 0)),
        canSend: (usage?.ai_messages_count || 0) < sub.max_ai_messages_per_day,
      },
      ai_images_today: {
        used: usage?.ai_images_count || 0,
        limit: sub.max_ai_images_per_day,
        percentage: ((usage?.ai_images_count || 0) / sub.max_ai_images_per_day) * 100,
        remaining: Math.max(0, sub.max_ai_images_per_day - (usage?.ai_images_count || 0)),
        canGenerate: (usage?.ai_images_count || 0) < sub.max_ai_images_per_day,
      },
    };

    // Calculate trial info
    const isTrialactive = sub.status === 'trialing' && sub.trial_ends_at;
    const trialDaysRemaining = isTrialactive
      ? Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    // Next billing amount
    const nextBillingAmountCents =
      sub.billing_cycle === 'monthly'
        ? sub.price_monthly_cents
        : sub.price_yearly_cents;

    return {
      subscription: sub as any,
      usage: usage || ({} as any),
      limits,
      next_billing_date: sub.current_period_end,
      next_billing_amount_cents: nextBillingAmountCents,
      is_trial: isTrialactive,
      trial_days_remaining: trialDaysRemaining,
      payment_method: null, // TODO: Fetch from Stripe if needed
    };
  },
});

/**
 * Get upgrade options with pricing
 */
export const getUpgradeOptions = createServerAction<void, UpgradeOption[]>({
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ workspaceId, supabase }) => {
    const { data: currentSub } = await supabase
      .from('workspace_subscriptions')
      .select('*, tier:subscription_tiers(*)')
      .eq('workspace_id', workspaceId)
      .single();

    const { data: allTiers } = await supabase
      .from('subscription_tiers')
      .select('*')
      .order('position');

    if (!allTiers) return [];

    const options: UpgradeOption[] = [];
    const currentTierPosition = currentSub?.tier?.position || 0;

    for (const tier of allTiers) {
      // Only show tiers above current tier
      if (tier.position <= currentTierPosition) continue;

      // Monthly option
      options.push({
        tier: tier as any,
        billing_cycle: 'monthly',
        price_cents: tier.price_monthly_cents,
        proration_amount_cents: 0, // TODO: Calculate actual proration
        immediate_charge_cents: 0,
        savings_vs_monthly: 0,
      });

      // Yearly option (with 20% discount)
      const yearlyMonthlyEquivalent = tier.price_monthly_cents * 12;
      const yearlySavings = yearlyMonthlyEquivalent - tier.price_yearly_cents;

      options.push({
        tier: tier as any,
        billing_cycle: 'yearly',
        price_cents: tier.price_yearly_cents,
        proration_amount_cents: 0,
        immediate_charge_cents: 0,
        savings_vs_monthly: yearlySavings,
      });
    }

    return options;
  },
});

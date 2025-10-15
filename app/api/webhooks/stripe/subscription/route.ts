import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyWebhookSignature } from '@/lib/stripe/subscription-config';
import { createClient } from '@/lib/supabase/server-admin';
import { headers } from 'next/headers';

// Disable body parsing for webhook
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = verifyWebhookSignature(body, signature);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Log the event
  console.log(`Received Stripe event: ${event.type}`);

  try {
    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

async function handleWebhookEvent(event: Stripe.Event) {
  const supabase = createClient();

  switch (event.type) {
    // Customer events
    case 'customer.created':
      await handleCustomerCreated(event.data.object as Stripe.Customer, supabase);
      break;

    case 'customer.updated':
      await handleCustomerUpdated(event.data.object as Stripe.Customer, supabase);
      break;

    // Subscription events
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
      break;

    case 'customer.subscription.trial_will_end':
      await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase);
      break;

    // Invoice events
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice, supabase);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase);
      break;

    case 'invoice.payment_action_required':
      await handleInvoicePaymentActionRequired(event.data.object as Stripe.Invoice, supabase);
      break;

    // Payment intent events
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, supabase);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, supabase);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Log billing event
  await supabase.from('billing_events').insert({
    workspace_id: event.data.object.metadata?.workspace_id,
    event_type: event.type,
    event_data: event.data.object,
    stripe_event_id: event.id,
  });
}

// ===== Event Handlers =====

async function handleCustomerCreated(customer: Stripe.Customer, supabase: any) {
  const workspaceId = customer.metadata.workspace_id;
  if (!workspaceId) return;

  // Update workspace with Stripe customer ID
  await supabase
    .from('workspace_subscriptions')
    .upsert({
      workspace_id: workspaceId,
      stripe_customer_id: customer.id,
      tier_id: 'free',
      status: 'active',
    }, {
      onConflict: 'workspace_id'
    });
}

async function handleCustomerUpdated(customer: Stripe.Customer, supabase: any) {
  // Update customer details if needed
  console.log('Customer updated:', customer.id);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const workspaceId = subscription.metadata.workspace_id;
  if (!workspaceId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const tierId = getTierIdFromPrice(priceId);
  const billingCycle = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly';

  await supabase.from('workspace_subscriptions').upsert({
    workspace_id: workspaceId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    tier_id: tierId,
    billing_cycle: billingCycle,
    status: subscription.status,
    trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    trial_started_at: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  }, {
    onConflict: 'workspace_id'
  });

  // Update workspace tier
  await supabase
    .from('workspaces')
    .update({ subscription_tier: tierId })
    .eq('id', workspaceId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const workspaceId = subscription.metadata.workspace_id;
  if (!workspaceId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const tierId = getTierIdFromPrice(priceId);
  const billingCycle = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly';

  await supabase
    .from('workspace_subscriptions')
    .update({
      stripe_price_id: priceId,
      tier_id: tierId,
      billing_cycle: billingCycle,
      status: subscription.status,
      trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  // Update workspace tier
  await supabase
    .from('workspaces')
    .update({ subscription_tier: tierId })
    .eq('id', workspaceId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const workspaceId = subscription.metadata.workspace_id;
  if (!workspaceId) return;

  await supabase
    .from('workspace_subscriptions')
    .update({
      status: 'canceled',
      tier_id: 'free',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  // Downgrade workspace to free tier
  await supabase
    .from('workspaces')
    .update({ subscription_tier: 'free' })
    .eq('id', workspaceId);
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  const workspaceId = subscription.metadata.workspace_id;
  if (!workspaceId) return;

  // Send email notification (implement email service)
  console.log(`Trial ending soon for workspace ${workspaceId}`);

  // TODO: Send email notification
  // await sendTrialEndingEmail(workspaceId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice, supabase: any) {
  const workspaceId = invoice.metadata?.workspace_id || invoice.subscription_details?.metadata?.workspace_id;
  if (!workspaceId) return;

  // Record payment
  await supabase.from('payment_history').insert({
    workspace_id: workspaceId,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_invoice_id: invoice.id,
    amount_cents: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    description: invoice.description || 'Subscription payment',
    invoice_url: invoice.hosted_invoice_url,
    receipt_url: invoice.invoice_pdf,
    payment_method_type: invoice.payment_settings?.payment_method_types?.[0] || 'card',
  });

  // Update subscription status to active if it was past_due
  if (invoice.subscription) {
    await supabase
      .from('workspace_subscriptions')
      .update({ status: 'active' })
      .eq('stripe_subscription_id', invoice.subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  const workspaceId = invoice.metadata?.workspace_id || invoice.subscription_details?.metadata?.workspace_id;
  if (!workspaceId) return;

  // Record failed payment
  await supabase.from('payment_history').insert({
    workspace_id: workspaceId,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_invoice_id: invoice.id,
    amount_cents: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    description: invoice.description || 'Subscription payment',
    invoice_url: invoice.hosted_invoice_url,
    failed_reason: invoice.last_finalization_error?.message || 'Payment failed',
    failed_at: new Date().toISOString(),
  });

  // Update subscription status
  if (invoice.subscription) {
    await supabase
      .from('workspace_subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', invoice.subscription);
  }

  // TODO: Send failed payment email
  // await sendPaymentFailedEmail(workspaceId, invoice);
}

async function handleInvoicePaymentActionRequired(invoice: Stripe.Invoice, supabase: any) {
  const workspaceId = invoice.metadata?.workspace_id || invoice.subscription_details?.metadata?.workspace_id;
  if (!workspaceId) return;

  // TODO: Send email requiring action
  console.log(`Payment action required for workspace ${workspaceId}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  // Handle one-time payments (not subscriptions)
  console.log('Payment intent succeeded:', paymentIntent.id);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  // Handle failed one-time payments
  console.log('Payment intent failed:', paymentIntent.id);
}

// Helper function to determine tier from price ID
function getTierIdFromPrice(priceId: string): string {
  // Map your Stripe price IDs to tier IDs
  const priceToTierMap: Record<string, string> = {
    [process.env.STRIPE_PRO_MONTHLY_PRICE_ID!]: 'pro',
    [process.env.STRIPE_PRO_YEARLY_PRICE_ID!]: 'pro',
    [process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID!]: 'business',
    [process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID!]: 'business',
  };

  return priceToTierMap[priceId] || 'free';
}

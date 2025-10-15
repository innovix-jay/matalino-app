import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createSubscriptionCheckout,
  createBillingPortal,
  changeSubscriptionTier,
  cancelWorkspaceSubscription,
  reactivateWorkspaceSubscription,
  getSubscriptionDetails,
  getUpgradeOptions,
} from '@/lib/actions/subscriptions';
import { BillingSummary, UpgradeOption, SubscriptionTierId, BillingCycle } from '@/types/subscription';

// Query keys
export const subscriptionKeys = {
  all: ['subscription'] as const,
  details: () => [...subscriptionKeys.all, 'details'] as const,
  usage: () => [...subscriptionKeys.all, 'usage'] as const,
  options: () => [...subscriptionKeys.all, 'options'] as const,
};

// ===== Queries =====

export function useSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.details(),
    queryFn: async () => {
      const result = await getSubscriptionDetails();
      if (result.error) throw result.error;
      return result.data;
    },
    staleTime: 60000, // 1 minute
  });
}

export function useUpgradeOptions() {
  return useQuery({
    queryKey: subscriptionKeys.options(),
    queryFn: async () => {
      const result = await getUpgradeOptions();
      if (result.error) throw result.error;
      return result.data!;
    },
    staleTime: 300000, // 5 minutes
  });
}

// ===== Mutations =====

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (params: {
      tierId: 'pro' | 'business';
      billingCycle: BillingCycle;
      successUrl: string;
      cancelUrl: string;
    }) => {
      const result = await createSubscriptionCheckout(params);
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.error('Failed to create checkout session', {
        description: error.message,
      });
    },
  });
}

export function useOpenBillingPortal() {
  return useMutation({
    mutationFn: async (returnUrl: string) => {
      const result = await createBillingPortal({ returnUrl });
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.error('Failed to open billing portal', {
        description: error.message,
      });
    },
  });
}

export function useChangeTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tierId: SubscriptionTierId;
      billingCycle?: BillingCycle;
    }) => {
      const result = await changeSubscriptionTier(params);
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.details() });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error('Failed to change subscription', {
        description: error.message,
      });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      immediately?: boolean;
      reason?: string;
      feedback?: string;
    }) => {
      const result = await cancelWorkspaceSubscription(params);
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.details() });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel subscription', {
        description: error.message,
      });
    },
  });
}

export function useReactivateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await reactivateWorkspaceSubscription();
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.details() });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error('Failed to reactivate subscription', {
        description: error.message,
      });
    },
  });
}

// ===== Helper Hooks =====

/**
 * Check if user is on a specific tier
 */
export function useIsOnTier(tierId: SubscriptionTierId) {
  const { data: subscription } = useSubscription();
  return subscription?.subscription.tier_id === tierId;
}

/**
 * Check if user has access to a feature
 */
export function useHasFeature(feature: keyof BillingSummary['subscription']) {
  const { data: subscription } = useSubscription();
  return subscription?.subscription[feature] === true;
}

/**
 * Get usage percentage for a resource
 */
export function useResourceUsage(resource: keyof BillingSummary['limits']) {
  const { data: subscription } = useSubscription();
  return subscription?.limits[resource];
}

/**
 * Check if user is in trial
 */
export function useIsTrial() {
  const { data: subscription } = useSubscription();
  return subscription?.is_trial || false;
}

/**
 * Get trial days remaining
 */
export function useTrialDaysRemaining() {
  const { data: subscription } = useSubscription();
  return subscription?.trial_days_remaining || 0;
}

/**
 * Check if subscription is canceled
 */
export function useIsCanceled() {
  const { data: subscription } = useSubscription();
  return subscription?.subscription.cancel_at_period_end || false;
}

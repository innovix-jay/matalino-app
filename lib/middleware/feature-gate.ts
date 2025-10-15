import { createClient } from '@/lib/supabase/server';
import { SubscriptionTierId, FeatureGateResult } from '@/types/subscription';

/**
 * Check if workspace has access to a feature
 */
export async function checkFeatureAccess(
  workspaceId: string,
  feature: string
): Promise<FeatureGateResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('can_use_feature', {
    p_workspace_id: workspaceId,
    p_feature: feature,
  });

  if (error || !data) {
    return {
      allowed: false,
      reason: 'Unable to verify feature access',
    };
  }

  if (!data) {
    // Get current tier for upgrade suggestion
    const { data: sub } = await supabase
      .from('workspace_subscriptions')
      .select('tier_id')
      .eq('workspace_id', workspaceId)
      .single();

    const currentTier = sub?.tier_id || 'free';
    const requiredTier = getRequiredTierForFeature(feature);

    return {
      allowed: false,
      reason: `This feature requires ${requiredTier} plan`,
      upgrade_required: {
        feature,
        required_tier: requiredTier,
        current_tier: currentTier as SubscriptionTierId,
      },
    };
  }

  return { allowed: true };
}

/**
 * Check if workspace can create more of a resource
 */
export async function checkResourceLimit(
  workspaceId: string,
  resourceType: 'products' | 'email_subscribers' | 'team_members'
): Promise<FeatureGateResult> {
  const supabase = createClient();

  // Get subscription with limits
  const { data: subData } = await supabase.rpc('get_workspace_subscription', {
    p_workspace_id: workspaceId,
  });

  if (!subData || subData.length === 0) {
    return {
      allowed: false,
      reason: 'No subscription found',
    };
  }

  const sub = subData[0];

  // Get current counts
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('products_count, email_subscribers_count')
    .eq('id', workspaceId)
    .single();

  if (!workspace) {
    return { allowed: false, reason: 'Workspace not found' };
  }

  let currentCount = 0;
  let limit = 0;

  switch (resourceType) {
    case 'products':
      currentCount = workspace.products_count || 0;
      limit = sub.max_products;
      break;
    case 'email_subscribers':
      currentCount = workspace.email_subscribers_count || 0;
      limit = sub.max_email_subscribers;
      break;
    case 'team_members':
      // TODO: Query team members count
      currentCount = 1;
      limit = sub.max_team_members;
      break;
  }

  if (currentCount >= limit) {
    return {
      allowed: false,
      reason: `You've reached your limit of ${limit} ${resourceType.replace('_', ' ')}`,
      upgrade_required: {
        feature: resourceType,
        required_tier: getNextTier(sub.tier_id),
        current_tier: sub.tier_id as SubscriptionTierId,
      },
    };
  }

  return { allowed: true };
}

/**
 * Check if workspace can use AI features today
 */
export async function checkAIUsageLimit(
  workspaceId: string,
  usageType: 'messages' | 'images'
): Promise<FeatureGateResult> {
  const supabase = createClient();

  const { data } = await supabase.rpc('get_workspace_today_usage', {
    p_workspace_id: workspaceId,
  });

  if (!data || data.length === 0) {
    return { allowed: false, reason: 'Unable to check usage' };
  }

  const usage = data[0];

  if (usageType === 'messages') {
    if (usage.ai_messages_remaining <= 0) {
      return {
        allowed: false,
        reason: `Daily AI message limit reached (${usage.max_ai_messages} messages). Resets tomorrow.`,
        upgrade_required: {
          feature: 'ai_messages',
          required_tier: getNextTier(usage.current_tier),
          current_tier: usage.current_tier,
        },
      };
    }
  } else if (usageType === 'images') {
    if (usage.ai_images_remaining <= 0) {
      return {
        allowed: false,
        reason: `Daily AI image limit reached (${usage.max_ai_images} images). Resets tomorrow.`,
        upgrade_required: {
          feature: 'ai_images',
          required_tier: getNextTier(usage.current_tier),
          current_tier: usage.current_tier,
        },
      };
    }
  }

  return { allowed: true };
}

/**
 * Increment usage counter
 */
export async function incrementUsage(
  workspaceId: string,
  usageType: 'ai_messages' | 'ai_images' | 'storage' | 'bandwidth',
  amount: number = 1
): Promise<void> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  await supabase.rpc('increment_workspace_usage', {
    p_workspace_id: workspaceId,
    p_date: today,
    p_usage_type: usageType,
    p_amount: amount,
  });
}

/**
 * Feature gate decorator for server actions
 */
export function withFeatureGate(feature: string) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: T,
    context: ClassMethodDecoratorContext
  ) {
    return async function (this: any, ...args: any[]) {
      // Extract workspaceId from first arg (convention)
      const workspaceId = args[0]?.workspaceId;

      if (!workspaceId) {
        throw new Error('workspaceId required for feature gate');
      }

      const result = await checkFeatureAccess(workspaceId, feature);

      if (!result.allowed) {
        throw new Error(result.reason || 'Feature not available on your plan');
      }

      return target.apply(this, args);
    };
  };
}

/**
 * Resource limit gate decorator
 */
export function withResourceLimit(resourceType: 'products' | 'email_subscribers' | 'team_members') {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: T,
    context: ClassMethodDecoratorContext
  ) {
    return async function (this: any, ...args: any[]) {
      const workspaceId = args[0]?.workspaceId;

      if (!workspaceId) {
        throw new Error('workspaceId required for resource limit check');
      }

      const result = await checkResourceLimit(workspaceId, resourceType);

      if (!result.allowed) {
        throw new Error(result.reason || `Resource limit reached for ${resourceType}`);
      }

      return target.apply(this, args);
    };
  };
}

/**
 * AI usage limit gate decorator
 */
export function withAIUsageLimit(usageType: 'messages' | 'images') {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: T,
    context: ClassMethodDecoratorContext
  ) {
    return async function (this: any, ...args: any[]) {
      const workspaceId = args[0]?.workspaceId;

      if (!workspaceId) {
        throw new Error('workspaceId required for AI usage check');
      }

      const result = await checkAIUsageLimit(workspaceId, usageType);

      if (!result.allowed) {
        throw new Error(result.reason || `AI usage limit reached`);
      }

      // Increment usage after successful check
      await incrementUsage(workspaceId, usageType === 'messages' ? 'ai_messages' : 'ai_images');

      return target.apply(this, args);
    };
  };
}

// Helper functions

function getRequiredTierForFeature(feature: string): SubscriptionTierId {
  const featureTierMap: Record<string, SubscriptionTierId> = {
    custom_domain: 'pro',
    email_automation: 'pro',
    priority_support: 'pro',
    remove_branding: 'pro',
    white_label: 'business',
    api_access: 'business',
  };

  return featureTierMap[feature] || 'pro';
}

function getNextTier(currentTier: string): SubscriptionTierId {
  const tierProgression: Record<string, SubscriptionTierId> = {
    free: 'pro',
    pro: 'business',
    business: 'business',
  };

  return tierProgression[currentTier] || 'pro';
}

/**
 * Batch check multiple features
 */
export async function checkMultipleFeatures(
  workspaceId: string,
  features: string[]
): Promise<Record<string, FeatureGateResult>> {
  const results: Record<string, FeatureGateResult> = {};

  await Promise.all(
    features.map(async (feature) => {
      results[feature] = await checkFeatureAccess(workspaceId, feature);
    })
  );

  return results;
}

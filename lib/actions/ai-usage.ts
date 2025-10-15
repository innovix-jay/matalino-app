'use server';

import { createServerAction } from '@/lib/api/server-action';
import { z } from 'zod';

// ===== Types =====

export interface AIUsageStats {
  modelId: string;
  requestCount: number;
  totalCostCents: number;
  totalInputTokens: number;
  totalOutputTokens: number;
}

export interface DailyBudgetStatus {
  dailySpentCents: number;
  dailyLimitCents: number;
  remainingCents: number;
  percentageUsed: number;
}

export interface RoutingInsights {
  totalRequests: number;
  autoRoutedCount: number;
  manualOverrideCount: number;
  avgComplexityScore: number;
  costOptimizationSavingsCents: number;
}

export interface MonthlyUsageSummary {
  monthlySpentCents: number;
  monthlyRequests: number;
  avgCostPerRequest: number;
  modelBreakdown: AIUsageStats[];
  estimatedSavingsCents: number;
}

// ===== Schemas =====

const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// ===== Actions =====

export const getAIUsageStats = createServerAction<
  z.infer<typeof dateRangeSchema>,
  MonthlyUsageSummary
>({
  schema: dateRangeSchema,
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, userId, supabase }) => {
    const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const endDate = input.endDate || new Date().toISOString().split('T')[0];

    // Get usage stats from RPC function
    const { data: stats, error: statsError } = await supabase.rpc('get_ai_usage_stats', {
      p_user_id: userId,
      p_start_date: startDate,
      p_end_date: endDate,
    });

    if (statsError) throw statsError;

    const modelBreakdown: AIUsageStats[] = (stats || []).map((stat: any) => ({
      modelId: stat.model_id,
      requestCount: parseInt(stat.request_count),
      totalCostCents: parseInt(stat.total_cost_cents),
      totalInputTokens: parseInt(stat.total_input_tokens),
      totalOutputTokens: parseInt(stat.total_output_tokens),
    }));

    const monthlySpentCents = modelBreakdown.reduce(
      (sum, model) => sum + model.totalCostCents,
      0
    );
    const monthlyRequests = modelBreakdown.reduce(
      (sum, model) => sum + model.requestCount,
      0
    );

    // Get routing insights for estimated savings
    const { data: insights, error: insightsError } = await supabase.rpc('get_routing_insights', {
      p_user_id: userId,
      p_days: 30,
    });

    if (insightsError) throw insightsError;

    const estimatedSavingsCents = insights?.[0]?.cost_optimization_savings_cents || 0;

    return {
      monthlySpentCents,
      monthlyRequests,
      avgCostPerRequest: monthlyRequests > 0 ? monthlySpentCents / monthlyRequests : 0,
      modelBreakdown,
      estimatedSavingsCents: parseInt(estimatedSavingsCents),
    };
  },
});

export const getDailyBudgetStatus = createServerAction<void, DailyBudgetStatus>({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ userId, supabase }) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase.rpc('check_daily_ai_budget', {
      p_user_id: userId,
      p_date: today,
    });

    if (error) throw error;

    const result = data?.[0];
    if (!result) {
      return {
        dailySpentCents: 0,
        dailyLimitCents: 1000, // Default $10/day
        remainingCents: 1000,
        percentageUsed: 0,
      };
    }

    return {
      dailySpentCents: parseInt(result.daily_spent_cents),
      dailyLimitCents: result.daily_limit_cents,
      remainingCents: result.remaining_cents,
      percentageUsed: parseFloat(result.percentage_used),
    };
  },
});

export const getRoutingInsights = createServerAction<
  { days?: number },
  RoutingInsights
>({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, userId, supabase }) => {
    const { data, error } = await supabase.rpc('get_routing_insights', {
      p_user_id: userId,
      p_days: input.days || 30,
    });

    if (error) throw error;

    const result = data?.[0];
    if (!result) {
      return {
        totalRequests: 0,
        autoRoutedCount: 0,
        manualOverrideCount: 0,
        avgComplexityScore: 0,
        costOptimizationSavingsCents: 0,
      };
    }

    return {
      totalRequests: parseInt(result.total_requests),
      autoRoutedCount: parseInt(result.auto_routed_count),
      manualOverrideCount: parseInt(result.manual_override_count),
      avgComplexityScore: parseFloat(result.avg_complexity_score),
      costOptimizationSavingsCents: parseInt(result.cost_optimization_savings_cents),
    };
  },
});

export const getDailyUsageHistory = createServerAction<
  { days?: number },
  Array<{ date: string; costCents: number; requests: number }>
>({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, userId, supabase }) => {
    const days = input.days || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await supabase
      .from('ai_daily_usage')
      .select('date, total_cost_cents, request_count')
      .eq('user_id', userId)
      .gte('date', startDate)
      .order('date', { ascending: true });

    if (error) throw error;

    // Group by date (sum across all models)
    const dailyMap = new Map<string, { costCents: number; requests: number }>();

    (data || []).forEach((row) => {
      const existing = dailyMap.get(row.date) || { costCents: 0, requests: 0 };
      dailyMap.set(row.date, {
        costCents: existing.costCents + row.total_cost_cents,
        requests: existing.requests + row.request_count,
      });
    });

    return Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

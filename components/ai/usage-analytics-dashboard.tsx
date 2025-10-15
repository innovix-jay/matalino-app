'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAIUsageStats,
  getDailyBudgetStatus,
  getRoutingInsights,
  getDailyUsageHistory,
} from '@/lib/actions/ai-usage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Zap, Brain, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function UsageAnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['ai-usage-stats'],
    queryFn: async () => {
      const result = await getAIUsageStats({});
      if (result.error) throw result.error;
      return result.data!;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ['ai-daily-budget'],
    queryFn: async () => {
      const result = await getDailyBudgetStatus();
      if (result.error) throw result.error;
      return result.data!;
    },
    refetchInterval: 60000,
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['ai-routing-insights'],
    queryFn: async () => {
      const result = await getRoutingInsights({ days: 30 });
      if (result.error) throw result.error;
      return result.data!;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: dailyHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['ai-daily-history'],
    queryFn: async () => {
      const result = await getDailyUsageHistory({ days: 30 });
      if (result.error) throw result.error;
      return result.data!;
    },
    refetchInterval: 300000,
  });

  if (statsLoading || budgetLoading || insightsLoading || historyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const budgetPercentage = budget ? (budget.dailySpentCents / budget.dailyLimitCents) * 100 : 0;
  const autoRoutingPercentage = insights && insights.totalRequests > 0
    ? (insights.autoRoutedCount / insights.totalRequests) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Spend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((stats?.monthlySpentCents || 0) / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.monthlyRequests || 0} requests this month
            </p>
          </CardContent>
        </Card>

        {/* Estimated Savings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${((stats?.estimatedSavingsCents || 0) / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From intelligent routing
            </p>
          </CardContent>
        </Card>

        {/* Avg Cost Per Request */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Per Request</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((stats?.avgCostPerRequest || 0) / 100).toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average cost efficiency
            </p>
          </CardContent>
        </Card>

        {/* Auto-Routing Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Routing</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoRoutingPercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {insights?.autoRoutedCount || 0} of {insights?.totalRequests || 0} requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Budget Status */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Budget Status</CardTitle>
          <CardDescription>
            Track your AI spending against your daily budget limit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ${((budget?.dailySpentCents || 0) / 100).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  of ${((budget?.dailyLimitCents || 0) / 100).toFixed(2)} daily limit
                </p>
              </div>
              <Badge
                variant={budgetPercentage >= 90 ? 'destructive' : budgetPercentage >= 70 ? 'default' : 'secondary'}
              >
                {budgetPercentage.toFixed(0)}% used
              </Badge>
            </div>
            <Progress value={budgetPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Remaining today: ${((budget?.remainingCents || 0) / 100).toFixed(2)}</span>
              <span>Resets at midnight</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Usage Trend</CardTitle>
          <CardDescription>Daily AI spending and request volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyHistory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `$${(value / 100).toFixed(2)}`}
                />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip
                  formatter={(value: any, name: string) => {
                    if (name === 'costCents') return [`$${(value / 100).toFixed(2)}`, 'Cost'];
                    return [value, 'Requests'];
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="costCents"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Cost"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="requests"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Model Usage Breakdown</CardTitle>
          <CardDescription>Usage and cost distribution by AI model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.modelBreakdown.map((model) => {
              const modelPercentage =
                stats.monthlySpentCents > 0
                  ? (model.totalCostCents / stats.monthlySpentCents) * 100
                  : 0;

              const modelInfo = getModelDisplayInfo(model.modelId);

              return (
                <div key={model.modelId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{modelInfo.icon}</span>
                      <span className="font-medium">{modelInfo.label}</span>
                      <Badge variant="outline">{model.requestCount} requests</Badge>
                    </div>
                    <span className="text-sm font-medium">
                      ${(model.totalCostCents / 100).toFixed(2)}
                    </span>
                  </div>
                  <Progress value={modelPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {model.totalInputTokens.toLocaleString()} in /{' '}
                      {model.totalOutputTokens.toLocaleString()} out
                    </span>
                    <span>{modelPercentage.toFixed(1)}% of total</span>
                  </div>
                </div>
              );
            })}

            {(!stats?.modelBreakdown || stats.modelBreakdown.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No usage data available yet. Start using AI features to see your breakdown.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Routing Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Routing Insights</CardTitle>
          <CardDescription>How AI model selection is optimizing your costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Avg Complexity Score</span>
              </div>
              <div className="text-3xl font-bold">
                {insights?.avgComplexityScore.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 4.0 (higher = more complex)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>Auto-Routed</span>
              </div>
              <div className="text-3xl font-bold">{autoRoutingPercentage.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                {insights?.autoRoutedCount || 0} automatically optimized
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span>Cost Savings</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ${((insights?.costOptimizationSavingsCents || 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Saved vs. always using premium models</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>How it works:</strong> Our intelligent routing analyzes each request's
              complexity and selects the most cost-effective model. Simple tasks use faster, cheaper
              models like Gemini Flash ($0.0075/1K tokens), while complex reasoning uses premium
              models like GPT-5 ($5/1K tokens).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getModelDisplayInfo(modelId: string): { icon: string; label: string; color: string } {
  const modelMap: Record<string, { icon: string; label: string; color: string }> = {
    'gpt-5': { icon: '⚡', label: 'GPT-5', color: 'text-purple-600' },
    'claude-sonnet-4-5': { icon: '🎯', label: 'Claude Sonnet 4.5', color: 'text-orange-600' },
    'gemini-2-5-pro': { icon: '💎', label: 'Gemini 2.5 Pro', color: 'text-blue-600' },
    'gemini-2-5-flash': { icon: '⚡', label: 'Gemini 2.5 Flash', color: 'text-green-600' },
  };

  return modelMap[modelId] || { icon: '🤖', label: modelId, color: 'text-gray-600' };
}

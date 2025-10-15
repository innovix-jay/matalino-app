'use server';

import { createServerAction } from '@/lib/api/server-action';
import { z } from 'zod';
import { UnifiedAIClient } from '@/lib/ai/providers/unified-client';
import { ModelRoutingEngine } from '@/lib/ai/routing-engine';
import {
  AIConversation,
  AIMessage,
  UserModelPreferences,
  DEFAULT_USER_MODEL_PREFERENCES
} from '@/types/ai';

const unifiedAI = new UnifiedAIClient();
const routingEngine = new ModelRoutingEngine();

// ===== Schemas =====

const createConversationSchema = z.object({
  title: z.string().min(1).max(200),
  context: z.object({
    location: z.enum(['global', 'product', 'email', 'biolink', 'storefront']),
    entityId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }).optional(),
});

const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(10000),
});

const getMessagesSchema = z.object({
  conversationId: z.string().uuid(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

// ===== Actions =====

export const createConversation = createServerAction<
  z.infer<typeof createConversationSchema>,
  AIConversation
>({
  schema: createConversationSchema,
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 30 },
  action: async ({ input, userId, supabase }) => {
    const { data: conversation, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        title: input.title,
        context: input.context || null,
      })
      .select()
      .single();

    if (error) throw error;
    return conversation;
  },
});

export const sendAIMessage = createServerAction<
  z.infer<typeof sendMessageSchema>,
  AIMessage & { assistantMessage: AIMessage }
>({
  schema: sendMessageSchema,
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 60 },
  action: async ({ input, userId, supabase }) => {
    // Verify conversation ownership
    const { data: conversation, error: convError } = await supabase
      .from('ai_conversations')
      .select('id, user_id, context')
      .eq('id', input.conversationId)
      .eq('user_id', userId)
      .single();

    if (convError || !conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Insert user message
    const { data: userMessage, error: userMsgError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: input.conversationId,
        role: 'user',
        content: input.content,
      })
      .select()
      .single();

    if (userMsgError) throw userMsgError;

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_ai_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const userPreferences: UserModelPreferences = preferences
      ? {
          autoSwitchingEnabled: preferences.auto_switching_enabled,
          preferredModel: preferences.preferred_model,
          autoSwitchingConfig: preferences.auto_switching_config,
          imageModelPreference: preferences.image_model_preference,
          imageStylePreference: preferences.image_style_preference,
          dailyBudgetCents: preferences.daily_budget_cents,
          warnAtPercentage: preferences.warn_at_percentage,
        }
      : DEFAULT_USER_MODEL_PREFERENCES;

    // Check daily budget
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyUsage } = await supabase
      .from('ai_daily_usage')
      .select('total_cost_cents')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    const todaySpent = dailyUsage?.total_cost_cents || 0;
    if (todaySpent >= userPreferences.dailyBudgetCents) {
      throw new Error(
        `Daily AI budget limit reached ($${(userPreferences.dailyBudgetCents / 100).toFixed(2)}). Reset tomorrow.`
      );
    }

    const warnThreshold = (userPreferences.dailyBudgetCents * userPreferences.warnAtPercentage) / 100;
    const shouldWarn = todaySpent >= warnThreshold && todaySpent < userPreferences.dailyBudgetCents;

    // Get conversation history (last 20 messages)
    const { data: history } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', input.conversationId)
      .order('created_at', { ascending: false })
      .limit(20);

    const messages = (history || []).reverse();

    // Call AI with routing
    const response = await unifiedAI.complete({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      context: {
        location: conversation.context?.location || 'global',
        entityId: conversation.context?.entityId,
        timeConstraint: 'interactive', // vs 'background', 'batch'
        qualityRequirement: 'high',
      },
      userPreferences,
    });

    // Insert assistant message with routing info
    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: input.conversationId,
        role: 'assistant',
        content: response.content,
        model_id: response.model,
        input_tokens: response.inputTokens,
        output_tokens: response.outputTokens,
        cost_cents: response.costCents,
        routing_decision: response.routingDecision,
      })
      .select()
      .single();

    if (assistantMsgError) throw assistantMsgError;

    // Update or insert daily usage
    await supabase.rpc('increment_daily_ai_usage', {
      p_user_id: userId,
      p_date: today,
      p_model_id: response.model,
      p_cost_cents: response.costCents,
      p_input_tokens: response.inputTokens,
      p_output_tokens: response.outputTokens,
    });

    // Update conversation title if it's the first exchange
    if (messages.length === 1) {
      const autoTitle = input.content.slice(0, 50) + (input.content.length > 50 ? '...' : '');
      await supabase
        .from('ai_conversations')
        .update({
          title: autoTitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.conversationId);
    }

    return {
      ...userMessage,
      assistantMessage: {
        ...assistantMessage,
        budgetWarning: shouldWarn
          ? `You've used ${((todaySpent / userPreferences.dailyBudgetCents) * 100).toFixed(0)}% of your daily AI budget.`
          : undefined,
      },
    };
  },
});

export const getConversationMessages = createServerAction<
  z.infer<typeof getMessagesSchema>,
  AIMessage[]
>({
  schema: getMessagesSchema,
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, userId, supabase }) => {
    // Verify conversation ownership
    const { data: conversation } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('id', input.conversationId)
      .eq('user_id', userId)
      .single();

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    const query = supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', input.conversationId)
      .order('created_at', { ascending: true });

    if (input.limit) query.limit(input.limit);
    if (input.offset) query.range(input.offset, input.offset + (input.limit || 50) - 1);

    const { data: messages, error } = await query;

    if (error) throw error;
    return messages || [];
  },
});

export const getUserConversations = createServerAction<
  { limit?: number; offset?: number },
  AIConversation[]
>({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, userId, supabase }) => {
    const query = supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (input.limit) query.limit(input.limit);
    if (input.offset) query.range(input.offset, input.offset + (input.limit || 50) - 1);

    const { data: conversations, error } = await query;

    if (error) throw error;
    return conversations || [];
  },
});

export const deleteConversation = createServerAction<
  { conversationId: string },
  void
>({
  schema: z.object({ conversationId: z.string().uuid() }),
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 30 },
  action: async ({ input, userId, supabase }) => {
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', input.conversationId)
      .eq('user_id', userId);

    if (error) throw error;
  },
});

export const updateConversationTitle = createServerAction<
  { conversationId: string; title: string },
  AIConversation
>({
  schema: z.object({
    conversationId: z.string().uuid(),
    title: z.string().min(1).max(200),
  }),
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 30 },
  action: async ({ input, userId, supabase }) => {
    const { data: conversation, error } = await supabase
      .from('ai_conversations')
      .update({
        title: input.title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.conversationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return conversation;
  },
});

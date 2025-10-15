import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createConversation,
  sendAIMessage,
  getConversationMessages,
  getUserConversations,
  deleteConversation,
  updateConversationTitle,
} from '@/lib/actions/ai-conversations';
import { AIConversation, AIMessage } from '@/types/ai';

// Query keys
export const conversationKeys = {
  all: ['ai-conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: { limit?: number; offset?: number }) =>
    [...conversationKeys.lists(), filters] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  messages: (id: string) => [...conversationKeys.detail(id), 'messages'] as const,
};

// ===== Queries =====

export function useConversations(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: conversationKeys.list(params || {}),
    queryFn: async () => {
      const result = await getUserConversations(params || {});
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: async () => {
      const result = await getConversationMessages({ conversationId });
      if (result.error) throw result.error;
      return result.data!;
    },
    refetchInterval: false, // Don't auto-refetch, we'll update optimistically
  });
}

// ===== Mutations =====

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      context?: {
        location: 'global' | 'product' | 'email' | 'biolink' | 'storefront';
        entityId?: string;
        metadata?: Record<string, any>;
      };
    }) => {
      const result = await createConversation(input);
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      toast.success('Conversation created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create conversation: ${error.message}`);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { conversationId: string; content: string }) => {
      const result = await sendAIMessage(input);
      if (result.error) throw result.error;
      return result.data!;
    },
    onMutate: async ({ conversationId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: conversationKeys.messages(conversationId) });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<AIMessage[]>(
        conversationKeys.messages(conversationId)
      );

      // Optimistically add user message
      const optimisticUserMessage: AIMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
        model_id: null,
        input_tokens: null,
        output_tokens: null,
        cost_cents: null,
        routing_decision: null,
      };

      queryClient.setQueryData<AIMessage[]>(
        conversationKeys.messages(conversationId),
        (old) => [...(old || []), optimisticUserMessage]
      );

      return { previousMessages };
    },
    onSuccess: (data, variables) => {
      // Replace optimistic message with real one and add assistant message
      queryClient.setQueryData<AIMessage[]>(
        conversationKeys.messages(variables.conversationId),
        (old) => {
          const withoutOptimistic = (old || []).filter((msg) => !msg.id.startsWith('temp-'));
          return [...withoutOptimistic, data, data.assistantMessage];
        }
      );

      // Show budget warning if present
      if (data.assistantMessage.budgetWarning) {
        toast.warning(data.assistantMessage.budgetWarning);
      }

      // Invalidate conversations list to update last message time
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });

      // Invalidate usage stats
      queryClient.invalidateQueries({ queryKey: ['ai-usage-stats'] });
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          conversationKeys.messages(variables.conversationId),
          context.previousMessages
        );
      }
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const result = await deleteConversation({ conversationId });
      if (result.error) throw result.error;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.removeQueries({ queryKey: conversationKeys.detail(conversationId) });
      toast.success('Conversation deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete conversation: ${error.message}`);
    },
  });
}

export function useUpdateConversationTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { conversationId: string; title: string }) => {
      const result = await updateConversationTitle(input);
      if (result.error) throw result.error;
      return result.data!;
    },
    onMutate: async ({ conversationId, title }) => {
      await queryClient.cancelQueries({ queryKey: conversationKeys.detail(conversationId) });

      const previousConversations = queryClient.getQueryData<AIConversation[]>(
        conversationKeys.lists()
      );

      // Optimistically update in list
      queryClient.setQueriesData<AIConversation[]>(
        { queryKey: conversationKeys.lists() },
        (old) =>
          old?.map((conv) =>
            conv.id === conversationId ? { ...conv, title } : conv
          )
      );

      return { previousConversations };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(conversationKeys.lists(), context.previousConversations);
      }
      toast.error(`Failed to update title: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      toast.success('Title updated');
    },
  });
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useConversations,
  useConversationMessages,
  useCreateConversation,
  useSendMessage,
  useDeleteConversation,
  useUpdateConversationTitle,
} from '@/lib/hooks/use-ai-conversations';
import { cn } from '@/lib/utils';
import { ModelIndicator } from './model-indicator';
import { AIMessage } from '@/types/ai';

interface AIChatProps {
  context?: {
    location: 'global' | 'product' | 'email' | 'biolink' | 'storefront';
    entityId?: string;
    metadata?: Record<string, any>;
  };
  className?: string;
}

export function AIChat({ context, className }: AIChatProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversations, isLoading: conversationsLoading } = useConversations({ limit: 50 });
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(
    selectedConversationId || ''
  );
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();
  const deleteConversationMutation = useDeleteConversation();
  const updateTitleMutation = useUpdateConversationTitle();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      textareaRef.current?.focus();
    }
  }, [selectedConversationId]);

  const handleNewConversation = async () => {
    const result = await createConversationMutation.mutateAsync({
      title: 'New Conversation',
      context,
    });
    setSelectedConversationId(result.id);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversationId) return;

    const content = message.trim();
    setMessage('');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId,
      content,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (confirm('Delete this conversation? This cannot be undone.')) {
      await deleteConversationMutation.mutateAsync(id);
      if (selectedConversationId === id) {
        setSelectedConversationId(null);
      }
    }
  };

  const handleStartEditTitle = (id: string, currentTitle: string) => {
    setEditingTitleId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveTitle = async () => {
    if (!editingTitleId || !editingTitle.trim()) return;

    await updateTitleMutation.mutateAsync({
      conversationId: editingTitleId,
      title: editingTitle.trim(),
    });

    setEditingTitleId(null);
    setEditingTitle('');
  };

  const handleCancelEditTitle = () => {
    setEditingTitleId(null);
    setEditingTitle('');
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className={cn('flex h-full border rounded-lg overflow-hidden', className)}>
      {/* Sidebar - Conversations List */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <Button onClick={handleNewConversation} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {conversationsLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading conversations...
            </div>
          ) : conversations?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet. Start a new one!
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations?.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    'group relative p-3 rounded-md cursor-pointer transition-colors',
                    selectedConversationId === conv.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => setSelectedConversationId(conv.id)}
                >
                  {editingTitleId === conv.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border rounded"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') handleCancelEditTitle();
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={handleSaveTitle}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={handleCancelEditTitle}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-medium truncate pr-12">{conv.title}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </div>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditTitle(conv.id, conv.title);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Start the conversation by sending a message below.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="min-h-[60px] max-h-[200px] resize-none"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                AI responses are powered by intelligent model routing to balance quality and cost.
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">No conversation selected</div>
              <div className="text-sm">Start a new conversation or select an existing one</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {!isUser && message.model_id && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <ModelIndicator
              model={message.model_id as any}
              cost={(message.cost_cents || 0) / 100}
              reasoning={message.routing_decision?.reasoning}
            />
          </div>
        )}

        <div className="text-xs opacity-70 mt-2">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useSendMessage, useCreateConversation } from '@/lib/hooks/use-ai-conversations';
import { ModelIndicator } from './model-indicator';

interface AIAssistantPopoverProps {
  context: {
    location: 'product' | 'email' | 'biolink' | 'storefront';
    entityId?: string;
    metadata?: Record<string, any>;
  };
  promptSuggestions?: string[];
  onApplySuggestion?: (suggestion: string) => void;
  triggerLabel?: string;
  triggerClassName?: string;
}

export function AIAssistantPopover({
  context,
  promptSuggestions = [],
  onApplySuggestion,
  triggerLabel = 'Ask AI',
  triggerClassName,
}: AIAssistantPopoverProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string; model?: string; cost?: number; reasoning?: string }>>([]);

  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    setPrompt('');

    // Add user message to UI
    setMessages((prev) => [...prev, { role: 'user', content: userPrompt }]);

    // Create conversation if needed
    let convId = conversationId;
    if (!convId) {
      const result = await createConversationMutation.mutateAsync({
        title: `AI Help: ${context.location}`,
        context,
      });
      convId = result.id;
      setConversationId(convId);
    }

    // Send message
    const response = await sendMessageMutation.mutateAsync({
      conversationId: convId,
      content: userPrompt,
    });

    // Add assistant message to UI
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: response.assistantMessage.content,
        model: response.assistantMessage.model_id || undefined,
        cost: response.assistantMessage.cost_cents ? response.assistantMessage.cost_cents / 100 : undefined,
        reasoning: response.assistantMessage.routing_decision?.reasoning,
      },
    ]);
  };

  const handleUseSuggestion = (suggestion: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
      setOpen(false);
    } else {
      setPrompt(suggestion);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setConversationId(null);
    setPrompt('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          <Sparkles className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
              <Badge variant="secondary" className="text-xs">
                {context.location}
              </Badge>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Prompt Suggestions */}
          {promptSuggestions.length > 0 && messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleUseSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-8'
                      : 'bg-muted mr-8'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  {message.role === 'assistant' && message.model && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <ModelIndicator
                        model={message.model as any}
                        cost={message.cost || 0}
                        reasoning={message.reasoning}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="Ask AI for help..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[80px] resize-none"
              disabled={sendMessageMutation.isPending}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Shift+Enter for new line
              </p>
              <Button
                onClick={handleSendMessage}
                disabled={!prompt.trim() || sendMessageMutation.isPending}
                size="sm"
              >
                {sendMessageMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

'use client';

import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCreateConversation, useSendMessage } from '@/lib/hooks/use-ai-conversations';
import { ModelIndicator } from './model-indicator';

interface AIContentGeneratorProps {
  contentType: 'product_description' | 'email_subject' | 'email_body' | 'bio_text' | 'meta_description';
  context?: Record<string, any>;
  onGenerated: (content: string) => void;
  triggerLabel?: string;
  existingContent?: string;
}

const contentTypeConfig = {
  product_description: {
    title: 'Generate Product Description',
    description: 'AI will create a compelling product description based on your input',
    promptLabel: 'Product details (name, features, benefits)',
    placeholder: 'Enter product name, key features, target audience, etc.',
    systemPrompt: 'You are a skilled copywriter. Generate a compelling, SEO-friendly product description.',
  },
  email_subject: {
    title: 'Generate Email Subject Line',
    description: 'AI will create attention-grabbing subject lines',
    promptLabel: 'Email purpose and key message',
    placeholder: 'Describe what the email is about and the main call-to-action',
    systemPrompt: 'Generate 3 compelling email subject lines (max 60 characters each). Be concise and attention-grabbing.',
  },
  email_body: {
    title: 'Generate Email Content',
    description: 'AI will write engaging email copy',
    promptLabel: 'Email details (purpose, audience, key points)',
    placeholder: 'Describe the email purpose, target audience, main message, and desired tone',
    systemPrompt: 'Write engaging email copy that is clear, persuasive, and action-oriented. Include a clear call-to-action.',
  },
  bio_text: {
    title: 'Generate Bio Text',
    description: 'AI will create a professional bio',
    promptLabel: 'Background information',
    placeholder: 'Your name, profession, achievements, interests, etc.',
    systemPrompt: 'Write a concise, professional bio that highlights key achievements and personality. Keep it under 150 words.',
  },
  meta_description: {
    title: 'Generate Meta Description',
    description: 'AI will create an SEO-optimized meta description',
    promptLabel: 'Page content summary',
    placeholder: 'Describe what this page is about',
    systemPrompt: 'Generate an SEO-optimized meta description (150-160 characters) that accurately summarizes the content and includes a call-to-action.',
  },
};

export function AIContentGenerator({
  contentType,
  context = {},
  onGenerated,
  triggerLabel,
  existingContent,
}: AIContentGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [responseMetadata, setResponseMetadata] = useState<{
    model?: string;
    cost?: number;
    reasoning?: string;
  }>({});

  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();

  const config = contentTypeConfig[contentType];

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    const fullPrompt = `${config.systemPrompt}\n\nUser input: ${userInput}${
      existingContent ? `\n\nExisting content to improve: ${existingContent}` : ''
    }${Object.keys(context).length > 0 ? `\n\nContext: ${JSON.stringify(context, null, 2)}` : ''}`;

    // Create temporary conversation
    const conversation = await createConversationMutation.mutateAsync({
      title: `AI: ${config.title}`,
      context: {
        location: 'global',
        metadata: { contentType, ...context },
      },
    });

    // Send message
    const response = await sendMessageMutation.mutateAsync({
      conversationId: conversation.id,
      content: fullPrompt,
    });

    setGeneratedContent(response.assistantMessage.content);
    setResponseMetadata({
      model: response.assistantMessage.model_id || undefined,
      cost: response.assistantMessage.cost_cents
        ? response.assistantMessage.cost_cents / 100
        : undefined,
      reasoning: response.assistantMessage.routing_decision?.reasoning,
    });
  };

  const handleApply = () => {
    onGenerated(generatedContent);
    setOpen(false);
    setUserInput('');
    setGeneratedContent('');
    setResponseMetadata({});
  };

  const handleReset = () => {
    setGeneratedContent('');
    setResponseMetadata({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="h-4 w-4 mr-2" />
          {triggerLabel || `Generate ${contentType.replace('_', ' ')}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Input */}
          <div className="space-y-2">
            <Label>{config.promptLabel}</Label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={config.placeholder}
              className="min-h-[100px]"
              disabled={sendMessageMutation.isPending}
            />
          </div>

          {/* Generate Button */}
          {!generatedContent && (
            <Button
              onClick={handleGenerate}
              disabled={!userInput.trim() || sendMessageMutation.isPending}
              className="w-full"
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Generated Content</Label>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Regenerate
                </Button>
              </div>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />

              {responseMetadata.model && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <ModelIndicator
                    model={responseMetadata.model as any}
                    cost={responseMetadata.cost || 0}
                    reasoning={responseMetadata.reasoning}
                  />
                  <span className="text-xs text-muted-foreground">
                    Edit the content above before applying
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {generatedContent && (
            <Button onClick={handleApply}>Apply to Form</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

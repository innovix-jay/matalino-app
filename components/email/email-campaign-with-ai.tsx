'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIContentGenerator } from '@/components/ai/ai-content-generator';
import { AIAssistantPopover } from '@/components/ai/ai-assistant-popover';
import { Badge } from '@/components/ui/badge';

interface EmailCampaignWithAIProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

export function EmailCampaignWithAI({
  onSubmit,
  isSubmitting = false,
}: EmailCampaignWithAIProps) {
  const { register, handleSubmit, setValue, watch } = useForm();

  const subject = watch('subject');
  const body = watch('body');
  const preheader = watch('preheader');

  const emailSuggestions = [
    'Best time to send this email',
    'Suggest A/B test variations',
    'Improve open rates',
    'Enhance call-to-action',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Campaign Details</CardTitle>
              <CardDescription>
                Create engaging email content with AI assistance
              </CardDescription>
            </div>
            <AIAssistantPopover
              context={{
                location: 'email',
                metadata: { subject, hasBody: !!body },
              }}
              promptSuggestions={emailSuggestions}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Summer Sale 2024"
            />
          </div>

          {/* Subject Line with AI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subject">Subject Line *</Label>
              <AIContentGenerator
                contentType="email_subject"
                context={{ campaignName: watch('name') }}
                existingContent={subject}
                onGenerated={(content) => setValue('subject', content)}
                triggerLabel="Generate Subject"
              />
            </div>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="Your attention-grabbing subject line..."
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {(subject?.length || 0)}/60 characters
              </span>
              {subject && subject.length <= 60 ? (
                <Badge variant="secondary" className="text-xs">
                  Optimal length
                </Badge>
              ) : subject && subject.length > 60 ? (
                <Badge variant="destructive" className="text-xs">
                  Too long
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Preheader Text */}
          <div className="space-y-2">
            <Label htmlFor="preheader">Preheader Text</Label>
            <Input
              id="preheader"
              {...register('preheader')}
              placeholder="Preview text shown after subject line"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              Appears after the subject line in inbox preview (max 100 characters)
            </p>
          </div>

          {/* Email Body with AI */}
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="body">Email Body *</Label>
                <AIContentGenerator
                  contentType="email_body"
                  context={{
                    subject,
                    campaignName: watch('name'),
                    audience: 'subscribers',
                  }}
                  existingContent={body}
                  onGenerated={(content) => setValue('body', content)}
                  triggerLabel="Generate Email"
                />
              </div>
              <Textarea
                id="body"
                {...register('body')}
                placeholder="Write your email content here... Use {{firstName}} for personalization."
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong>Personalization tags:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  <code className="px-2 py-1 bg-muted rounded">{'{{firstName}}'}</code>
                  <code className="px-2 py-1 bg-muted rounded">{'{{lastName}}'}</code>
                  <code className="px-2 py-1 bg-muted rounded">{'{{email}}'}</code>
                  <code className="px-2 py-1 bg-muted rounded">{'{{unsubscribeUrl}}'}</code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="text-sm text-muted-foreground">From: Your Name</div>
                  <div className="text-lg font-semibold">{subject || 'Subject line...'}</div>
                  {preheader && (
                    <div className="text-sm text-muted-foreground">{preheader}</div>
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: (body || 'Email body preview...').replace(/\n/g, '<br />'),
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Call-to-Action Button Text</Label>
              <Input
                id="ctaText"
                {...register('ctaText')}
                placeholder="e.g., Shop Now, Learn More"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaUrl">CTA Button URL</Label>
              <Input
                id="ctaUrl"
                {...register('ctaUrl')}
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span>✨</span>
            AI Email Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Subject length:</strong>{' '}
              {subject && subject.length <= 60
                ? 'Optimal for mobile preview'
                : 'Consider shortening for better mobile display'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>Personalization:</strong>{' '}
              {body?.includes('{{')
                ? 'Using merge tags for personalization'
                : 'Consider adding personalization tags'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              <strong>CTA:</strong>{' '}
              {watch('ctaText')
                ? 'Clear call-to-action defined'
                : 'Add a CTA to improve click-through rates'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Campaign'}
        </Button>
      </div>
    </form>
  );
}

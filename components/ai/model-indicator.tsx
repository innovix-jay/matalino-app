'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ModelType } from '@/types/ai';

interface ModelIndicatorProps {
  model: ModelType;
  cost: number;
  reasoning?: string;
}

const modelInfo: Record<ModelType, { icon: string; color: string; label: string }> = {
  'gpt-5': { icon: '⚡', color: 'text-purple-600', label: 'GPT-5' },
  'claude-sonnet-4-5': { icon: '🎯', color: 'text-orange-600', label: 'Claude Sonnet 4.5' },
  'gemini-2-5-pro': { icon: '💎', color: 'text-blue-600', label: 'Gemini 2.5 Pro' },
  'gemini-2-5-flash': { icon: '⚡', color: 'text-green-600', label: 'Gemini 2.5 Flash' },
};

export function ModelIndicator({ model, cost, reasoning }: ModelIndicatorProps) {
  const info = modelInfo[model] || {
    icon: '🤖',
    color: 'text-gray-600',
    label: model,
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center gap-1.5 text-xs cursor-help ${info.color}`}>
          <span>{info.icon}</span>
          <span className="font-medium">{info.label}</span>
          <span className="text-muted-foreground">${cost.toFixed(4)}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-medium mb-1">{info.label} selected</p>
        {reasoning && (
          <p className="text-sm text-muted-foreground mb-2">{reasoning}</p>
        )}
        <div className="text-xs space-y-1">
          <p>Cost: ${cost.toFixed(4)}</p>
          <p className="text-muted-foreground">
            This model was automatically selected based on your task complexity and preferences.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// ===== Model Types =====

export type TextModelType =
  | 'gpt-5'
  | 'claude-sonnet-4-5'
  | 'gemini-2-5-pro'
  | 'gemini-2-5-flash';

export type ImageModelType =
  | 'dalle3'
  | 'sdxl'
  | 'gemini-nano-banana'
  | 'midjourney';

export type ModelType = TextModelType | ImageModelType;

// ===== Task Types =====

export type TaskType =
  | 'code_generation'
  | 'creative_writing'
  | 'data_analysis'
  | 'email_writing'
  | 'customer_support'
  | 'product_description'
  | 'general_qa'
  | 'translation'
  | 'summarization'
  | 'content_moderation';

export type ImageStyleType =
  | 'photorealistic'
  | 'artistic'
  | 'abstract'
  | 'illustration'
  | 'sketch'
  | 'anime'
  | 'logo'
  | 'technical';

// ===== User Preferences =====

export interface UserModelPreferences {
  autoSwitchingEnabled: boolean;
  preferredModel: TextModelType;
  autoSwitchingConfig: {
    prioritizeCost: boolean;
    prioritizeSpeed: boolean;
    allowGPT5: boolean;
    allowGeminiPro: boolean;
    creativityPreference: 'balanced' | 'creative' | 'precise';
    taskOverrides: {
      emailWriting?: TextModelType;
      codeGeneration?: TextModelType;
      dataAnalysis?: TextModelType;
      customerSupport?: TextModelType;
      productDescription?: TextModelType;
      creativeWriting?: TextModelType;
    };
  };
  imageModelPreference: 'auto' | ImageModelType;
  imageStylePreference: string;
  dailyBudgetCents: number;
  warnAtPercentage: number;
}

export const DEFAULT_USER_MODEL_PREFERENCES: UserModelPreferences = {
  autoSwitchingEnabled: true,
  preferredModel: 'gemini-2-5-flash',
  autoSwitchingConfig: {
    prioritizeCost: true,
    prioritizeSpeed: false,
    allowGPT5: true,
    allowGeminiPro: true,
    creativityPreference: 'balanced',
    taskOverrides: {},
  },
  imageModelPreference: 'auto',
  imageStylePreference: 'balanced',
  dailyBudgetCents: 1000, // $10/day
  warnAtPercentage: 80,
};

// ===== Context & Routing =====

export interface AgentContext {
  location: 'global' | 'product' | 'email' | 'biolink' | 'storefront';
  entityId?: string;
  timeConstraint?: 'realtime' | 'interactive' | 'background' | 'batch';
  qualityRequirement?: 'high' | 'medium' | 'low';
  metadata?: Record<string, any>;
}

export interface TaskAnalysis {
  taskType: TaskType;
  complexityScore: number; // 1-4
  complexityTier: 'simple' | 'moderate' | 'complex' | 'advanced';
  reasoningDepth: number; // 1-4
  requiresCreativity: boolean;
  requiresPrecision: boolean;
  estimatedTokens: number;
  timeConstraint: 'realtime' | 'interactive' | 'background';
  recommendedModel: TextModelType;
  reasoning: string;
}

export interface ImagePromptAnalysis {
  isSimple: boolean;
  needsSpeed: boolean;
  style: ImageStyleType;
  requiresDetail: boolean;
  isAbstract: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  recommendedModel: ImageModelType;
  reasoning: string;
}

export interface RoutingDecision {
  selectedModel: ModelType;
  analysis: TaskAnalysis | ImagePromptAnalysis;
  wasAutoRouted: boolean;
  overrideReason?: string;
  estimatedCostCents: number;
  estimatedSavingsCents?: number;
  reasoning: string;
}

// ===== Conversation Types =====

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  context: AgentContext | null;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_cents: number | null;
  routing_decision: RoutingDecision | null;
  created_at: string;
  budgetWarning?: string;
}

// ===== Image Generation Types =====

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  style?: ImageStyleType;
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  quality?: 'standard' | 'hd';
  count?: number;
  seed?: number;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  workspace_id: string;
  prompt: string;
  negative_prompt: string | null;
  model_id: ImageModelType;
  style: ImageStyleType;
  size: string;
  image_url: string;
  thumbnail_url: string | null;
  cost_cents: number;
  generation_time_ms: number;
  routing_decision: RoutingDecision | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

// ===== Model Registry =====

export interface AIModel {
  model_id: string;
  provider: 'openai' | 'anthropic' | 'google' | 'stability' | 'midjourney';
  model_type: 'text' | 'image';
  display_name: string;
  input_cost_per_1k: number;
  output_cost_per_1k: number;
  complexity_tier: number | null;
  best_for: string[];
  is_active: boolean;
}

// ===== API Request/Response Types =====

export interface UnifiedCompletionRequest {
  messages: Array<{ role: string; content: string }>;
  context: AgentContext;
  userPreferences: UserModelPreferences;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface UnifiedCompletionResponse {
  content: string;
  model: TextModelType;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  routingDecision: RoutingDecision;
  finishReason: 'stop' | 'length' | 'content_filter';
}

export interface UnifiedImageResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
    revisedPrompt?: string;
  }>;
  model: ImageModelType;
  costCents: number;
  generationTimeMs: number;
  routingDecision: RoutingDecision;
}

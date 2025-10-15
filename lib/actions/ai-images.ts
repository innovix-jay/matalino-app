'use server';

import { createServerAction } from '@/lib/api/server-action';
import { z } from 'zod';
import { unifiedImageClient } from '@/lib/ai/providers/image-client';
import {
  GeneratedImage,
  ImageGenerationRequest,
  UserModelPreferences,
  DEFAULT_USER_MODEL_PREFERENCES,
  ImageStyleType,
} from '@/types/ai';
import { createClient } from '@/lib/supabase/server';

// ===== Schemas =====

const generateImageSchema = z.object({
  prompt: z.string().min(3).max(1000),
  negativePrompt: z.string().max(500).optional(),
  style: z.enum([
    'photorealistic',
    'artistic',
    'abstract',
    'illustration',
    'sketch',
    'anime',
    'logo',
    'technical',
  ]).optional(),
  size: z.enum(['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('standard'),
  count: z.number().int().min(1).max(4).default(1),
  tags: z.array(z.string()).optional(),
  collectionId: z.string().uuid().optional(),
});

const updateImageSchema = z.object({
  imageId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

const searchImagesSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  modelId: z.string().optional(),
  style: z.string().optional(),
  isFavorite: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

// ===== Actions =====

export const generateImage = createServerAction<
  z.infer<typeof generateImageSchema>,
  GeneratedImage
>({
  schema: generateImageSchema,
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 10 }, // 10 images per minute
  action: async ({ input, userId, workspaceId, supabase }) => {
    // Check workspace quota (optional - based on subscription tier)
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('images_generated_count, subscription_tier')
      .eq('id', workspaceId)
      .single();

    if (workspace) {
      const quotas: Record<string, number> = {
        free: 50,
        pro: 500,
        business: 5000,
      };

      const limit = quotas[workspace.subscription_tier] || 50;
      if (workspace.images_generated_count >= limit) {
        throw new Error(
          `Image generation quota exceeded. Upgrade to generate more images. (${workspace.images_generated_count}/${limit})`
        );
      }
    }

    // Get user AI preferences
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

    // Generate image
    const request: ImageGenerationRequest = {
      prompt: input.prompt,
      negativePrompt: input.negativePrompt,
      style: input.style,
      size: input.size,
      quality: input.quality,
      count: input.count,
    };

    const result = await unifiedImageClient.generate(request, userPreferences);

    // Save to database
    const { data: savedImage, error: saveError } = await supabase
      .from('generated_images')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        prompt: input.prompt,
        negative_prompt: input.negativePrompt || null,
        model_id: result.model,
        style: input.style || 'photorealistic',
        size: input.size,
        quality: input.quality,
        image_url: result.images[0].url,
        thumbnail_url: result.images[0].url, // Same for now, can generate thumbnails later
        cost_cents: result.costCents,
        generation_time_ms: result.generationTimeMs,
        routing_decision: result.routingDecision,
        tags: input.tags || [],
        metadata: {
          revisedPrompt: result.images[0].revisedPrompt,
          width: result.images[0].width,
          height: result.images[0].height,
        },
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Update daily usage
    await supabase.rpc('increment_daily_ai_usage', {
      p_user_id: userId,
      p_date: today,
      p_model_id: result.model,
      p_cost_cents: result.costCents,
      p_input_tokens: 0,
      p_output_tokens: 0,
    });

    // Add to collection if specified
    if (input.collectionId) {
      await supabase.from('image_collection_items').insert({
        collection_id: input.collectionId,
        image_id: savedImage.id,
      });
    }

    return savedImage;
  },
});

export const updateImage = createServerAction<
  z.infer<typeof updateImageSchema>,
  GeneratedImage
>({
  schema: updateImageSchema,
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, workspaceId, supabase }) => {
    const { data: image, error } = await supabase
      .from('generated_images')
      .update({
        tags: input.tags,
        is_favorite: input.isFavorite,
        is_public: input.isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.imageId)
      .eq('workspace_id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return image;
  },
});

export const deleteImage = createServerAction<
  { imageId: string },
  void
>({
  schema: z.object({ imageId: z.string().uuid() }),
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 50 },
  action: async ({ input, workspaceId, supabase }) => {
    // Soft delete
    const { error } = await supabase
      .from('generated_images')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', input.imageId)
      .eq('workspace_id', workspaceId);

    if (error) throw error;
  },
});

export const searchImages = createServerAction<
  z.infer<typeof searchImagesSchema>,
  GeneratedImage[]
>({
  schema: searchImagesSchema,
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, workspaceId, supabase }) => {
    let query = supabase
      .from('generated_images')
      .select('*')
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (input.query) {
      // Use RPC function for better search
      const { data, error } = await supabase.rpc('search_images_by_prompt', {
        p_workspace_id: workspaceId,
        p_search_query: input.query,
        p_limit: input.limit,
      });

      if (error) throw error;
      return data || [];
    }

    if (input.tags && input.tags.length > 0) {
      query = query.contains('tags', input.tags);
    }

    if (input.modelId) {
      query = query.eq('model_id', input.modelId);
    }

    if (input.style) {
      query = query.eq('style', input.style);
    }

    if (input.isFavorite !== undefined) {
      query = query.eq('is_favorite', input.isFavorite);
    }

    query = query.range(input.offset, input.offset + input.limit - 1);

    const { data: images, error } = await query;

    if (error) throw error;
    return images || [];
  },
});

export const createVariation = createServerAction<
  { imageId: string },
  GeneratedImage
>({
  schema: z.object({ imageId: z.string().uuid() }),
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 5 },
  action: async ({ input, userId, workspaceId, supabase }) => {
    // Get original image
    const { data: originalImage, error: fetchError } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', input.imageId)
      .eq('workspace_id', workspaceId)
      .single();

    if (fetchError) throw fetchError;

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

    // Create variation
    const result = await unifiedImageClient.createVariation(
      originalImage.image_url,
      userPreferences
    );

    // Save variation
    const { data: variation, error: saveError } = await supabase
      .from('generated_images')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        prompt: `Variation of: ${originalImage.prompt}`,
        model_id: result.model,
        style: originalImage.style,
        size: originalImage.size,
        quality: originalImage.quality,
        image_url: result.images[0].url,
        thumbnail_url: result.images[0].url,
        cost_cents: result.costCents,
        generation_time_ms: result.generationTimeMs,
        routing_decision: result.routingDecision,
        tags: [...(originalImage.tags || []), 'variation'],
        metadata: {
          originalImageId: originalImage.id,
          width: result.images[0].width,
          height: result.images[0].height,
        },
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Update daily usage
    const today = new Date().toISOString().split('T')[0];
    await supabase.rpc('increment_daily_ai_usage', {
      p_user_id: userId,
      p_date: today,
      p_model_id: result.model,
      p_cost_cents: result.costCents,
      p_input_tokens: 0,
      p_output_tokens: 0,
    });

    return variation;
  },
});

// Collection management
export const createCollection = createServerAction<
  { name: string; description?: string },
  any
>({
  schema: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  }),
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 20 },
  action: async ({ input, workspaceId, supabase }) => {
    const { data, error } = await supabase
      .from('image_collections')
      .insert({
        workspace_id: workspaceId,
        name: input.name,
        description: input.description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
});

export const addToCollection = createServerAction<
  { collectionId: string; imageId: string },
  void
>({
  schema: z.object({
    collectionId: z.string().uuid(),
    imageId: z.string().uuid(),
  }),
  requireAuth: true,
  requireWorkspace: true,
  rateLimit: { windowMs: 60000, maxRequests: 100 },
  action: async ({ input, supabase }) => {
    const { error } = await supabase
      .from('image_collection_items')
      .insert({
        collection_id: input.collectionId,
        image_id: input.imageId,
      });

    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw error;
    }
  },
});

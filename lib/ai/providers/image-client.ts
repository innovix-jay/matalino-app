import OpenAI from 'openai';
import {
  ImageModelType,
  ImageGenerationRequest,
  UnifiedImageResponse,
  RoutingDecision,
  UserModelPreferences,
} from '@/types/ai';
import { imageRoutingEngine } from '@/lib/ai/image-routing-engine';

// Initialize providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class UnifiedImageClient {
  /**
   * Generate an image with automatic model routing
   */
  async generate(
    request: ImageGenerationRequest,
    userPreferences: UserModelPreferences
  ): Promise<UnifiedImageResponse> {
    // Validate prompt
    const validation = imageRoutingEngine.validatePrompt(request.prompt);
    if (!validation.valid) {
      throw new Error(`Invalid prompt: ${validation.issues.join(', ')}`);
    }

    // Route to optimal model
    const routingDecision = await imageRoutingEngine.routeImageGeneration(
      request.prompt,
      userPreferences,
      request.size || '1024x1024',
      request.quality || 'standard'
    );

    const startTime = Date.now();
    let result: UnifiedImageResponse;

    // Call appropriate provider based on selected model
    switch (routingDecision.selectedModel) {
      case 'dalle3':
        result = await this.generateWithDallE3(request, routingDecision);
        break;
      case 'sdxl':
        result = await this.generateWithSDXL(request, routingDecision);
        break;
      case 'gemini-nano-banana':
        result = await this.generateWithGeminiNano(request, routingDecision);
        break;
      case 'midjourney':
        result = await this.generateWithMidjourney(request, routingDecision);
        break;
      default:
        throw new Error(`Unsupported image model: ${routingDecision.selectedModel}`);
    }

    result.generationTimeMs = Date.now() - startTime;
    return result;
  }

  /**
   * Generate with DALL-E 3
   */
  private async generateWithDallE3(
    request: ImageGenerationRequest,
    routingDecision: RoutingDecision
  ): Promise<UnifiedImageResponse> {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: request.prompt,
        n: 1,
        size: (request.size as '1024x1024' | '1024x1792' | '1792x1024') || '1024x1024',
        quality: request.quality || 'standard',
        response_format: 'url',
      });

      const image = response.data[0];

      return {
        images: [
          {
            url: image.url!,
            width: parseInt(request.size?.split('x')[0] || '1024'),
            height: parseInt(request.size?.split('x')[1] || '1024'),
            revisedPrompt: image.revised_prompt,
          },
        ],
        model: 'dalle3',
        costCents: routingDecision.estimatedCostCents,
        generationTimeMs: 0, // Will be set by caller
        routingDecision,
      };
    } catch (error: any) {
      throw new Error(`DALL-E 3 generation failed: ${error.message}`);
    }
  }

  /**
   * Generate with Stable Diffusion XL
   */
  private async generateWithSDXL(
    request: ImageGenerationRequest,
    routingDecision: RoutingDecision
  ): Promise<UnifiedImageResponse> {
    // Stability AI API
    const stabilityApiKey = process.env.STABILITY_API_KEY;
    if (!stabilityApiKey) {
      throw new Error('STABILITY_API_KEY not configured');
    }

    try {
      const [width, height] = (request.size || '1024x1024').split('x').map(Number);

      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${stabilityApiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: request.prompt,
              weight: 1,
            },
            ...(request.negativePrompt ? [{
              text: request.negativePrompt,
              weight: -1,
            }] : []),
          ],
          cfg_scale: 7,
          height,
          width,
          samples: request.count || 1,
          steps: 30,
          seed: request.seed || 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'SDXL generation failed');
      }

      const data = await response.json();
      const imageBase64 = data.artifacts[0].base64;

      // In production, upload to Supabase Storage
      // For now, return a data URL
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      return {
        images: [
          {
            url: imageUrl,
            width,
            height,
          },
        ],
        model: 'sdxl',
        costCents: routingDecision.estimatedCostCents,
        generationTimeMs: 0,
        routingDecision,
      };
    } catch (error: any) {
      throw new Error(`SDXL generation failed: ${error.message}`);
    }
  }

  /**
   * Generate with Gemini Nano Banana (Google Imagen)
   */
  private async generateWithGeminiNano(
    request: ImageGenerationRequest,
    routingDecision: RoutingDecision
  ): Promise<UnifiedImageResponse> {
    // Google Imagen API
    const googleApiKey = process.env.GOOGLE_AI_API_KEY;
    if (!googleApiKey) {
      throw new Error('GOOGLE_AI_API_KEY not configured');
    }

    try {
      // Simplified mock implementation - replace with actual Imagen API
      // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0:generateImage?key=${googleApiKey}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: request.prompt, ... })
      // });

      // For now, fallback to DALL-E 3 or return mock response
      throw new Error('Gemini Nano Banana not yet implemented - falling back to DALL-E 3');
    } catch (error: any) {
      // Fallback to DALL-E 3
      return this.generateWithDallE3(request, {
        ...routingDecision,
        selectedModel: 'dalle3',
      });
    }
  }

  /**
   * Generate with Midjourney (via API)
   */
  private async generateWithMidjourney(
    request: ImageGenerationRequest,
    routingDecision: RoutingDecision
  ): Promise<UnifiedImageResponse> {
    const midjourneyApiKey = process.env.MIDJOURNEY_API_KEY;
    if (!midjourneyApiKey) {
      throw new Error('MIDJOURNEY_API_KEY not configured - falling back to DALL-E 3');
    }

    try {
      // Midjourney API (via third-party service like GoAPI or Midjourney Bot)
      // This is a simplified example - actual implementation depends on your Midjourney access method

      const response = await fetch('https://api.midjourney.com/v1/imagine', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${midjourneyApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio || '1:1',
          quality: 1, // or 0.5 for faster
        }),
      });

      if (!response.ok) {
        throw new Error('Midjourney generation failed');
      }

      const data = await response.json();

      return {
        images: [
          {
            url: data.image_url,
            width: 1024,
            height: 1024,
          },
        ],
        model: 'midjourney',
        costCents: routingDecision.estimatedCostCents,
        generationTimeMs: 0,
        routingDecision,
      };
    } catch (error: any) {
      // Fallback to DALL-E 3 for highest quality
      console.warn('Midjourney failed, falling back to DALL-E 3:', error.message);
      return this.generateWithDallE3(request, {
        ...routingDecision,
        selectedModel: 'dalle3',
      });
    }
  }

  /**
   * Create variations of an existing image
   */
  async createVariation(
    imageUrl: string,
    userPreferences: UserModelPreferences
  ): Promise<UnifiedImageResponse> {
    try {
      // For DALL-E 2 (DALL-E 3 doesn't support variations yet)
      // Download the image first if it's a URL
      const imageFile = await this.urlToFile(imageUrl);

      const response = await openai.images.createVariation({
        model: 'dall-e-2',
        image: imageFile,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      const image = response.data[0];

      return {
        images: [
          {
            url: image.url!,
            width: 1024,
            height: 1024,
          },
        ],
        model: 'dalle3', // Using as proxy
        costCents: 200, // $0.02 per variation
        generationTimeMs: 0,
        routingDecision: {
          selectedModel: 'dalle3',
          analysis: {} as any,
          wasAutoRouted: false,
          estimatedCostCents: 200,
          reasoning: 'Image variation using DALL-E 2',
        },
      };
    } catch (error: any) {
      throw new Error(`Image variation failed: ${error.message}`);
    }
  }

  /**
   * Upscale an image (using external service)
   */
  async upscale(imageUrl: string): Promise<string> {
    // Implement with a service like Upscayl, Real-ESRGAN, or commercial API
    // For now, return original
    return imageUrl;
  }

  /**
   * Helper: Convert URL to File for OpenAI API
   */
  private async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'image.png', { type: 'image/png' });
  }
}

// Export singleton
export const unifiedImageClient = new UnifiedImageClient();

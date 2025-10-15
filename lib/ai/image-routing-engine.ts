import {
  ImageModelType,
  ImageStyleType,
  ImagePromptAnalysis,
  RoutingDecision,
  UserModelPreferences,
} from '@/types/ai';

// Image model pricing (per generation)
const IMAGE_MODEL_PRICING = {
  'dalle3': {
    standard: 4, // $0.04 per image (1024x1024)
    hd: 8,       // $0.08 per image (1024x1024)
    large: 12,   // $0.12 per image (1792x1024 or 1024x1792)
  },
  'sdxl': {
    standard: 2, // $0.02 per image
  },
  'gemini-nano-banana': {
    standard: 0.5, // $0.005 per image (fastest, cheapest)
  },
  'midjourney': {
    standard: 10, // $0.10 per image (highest quality)
  },
};

export class ImageRoutingEngine {
  /**
   * Analyzes an image prompt to determine characteristics
   */
  async analyzeImagePrompt(prompt: string): Promise<ImagePromptAnalysis> {
    const promptLower = prompt.toLowerCase();

    // Detect complexity
    const wordCount = prompt.split(/\s+/).length;
    const hasDetailedDescriptors = /detailed|intricate|complex|elaborate|sophisticated/.test(promptLower);
    const hasSimpleDescriptors = /simple|basic|minimal|clean|plain/.test(promptLower);

    const isSimple = wordCount < 10 || hasSimpleDescriptors;
    const requiresDetail = wordCount > 30 || hasDetailedDescriptors;

    // Detect speed requirement
    const needsSpeed = /quick|fast|draft|iteration|test|preview/.test(promptLower);

    // Detect style
    let style: ImageStyleType = 'photorealistic';
    if (/photo|realistic|real|portrait|landscape|photography/.test(promptLower)) {
      style = 'photorealistic';
    } else if (/artistic|art|painting|watercolor|oil|acrylic/.test(promptLower)) {
      style = 'artistic';
    } else if (/abstract|surreal|conceptual|experimental/.test(promptLower)) {
      style = 'abstract';
    } else if (/illustration|cartoon|drawing|comic|graphic/.test(promptLower)) {
      style = 'illustration';
    } else if (/sketch|pencil|charcoal|line art/.test(promptLower)) {
      style = 'sketch';
    } else if (/anime|manga|japanese/.test(promptLower)) {
      style = 'anime';
    } else if (/logo|brand|icon|symbol/.test(promptLower)) {
      style = 'logo';
    } else if (/diagram|technical|blueprint|schematic/.test(promptLower)) {
      style = 'technical';
    }

    const isAbstract = style === 'abstract';

    // Determine complexity tier
    let complexity: 'simple' | 'moderate' | 'complex' = 'moderate';
    if (isSimple && !requiresDetail) {
      complexity = 'simple';
    } else if (requiresDetail || wordCount > 40) {
      complexity = 'complex';
    }

    // Select recommended model
    let recommendedModel: ImageModelType = 'gemini-nano-banana';
    let reasoning = '';

    if (isSimple && needsSpeed) {
      recommendedModel = 'gemini-nano-banana';
      reasoning = 'Simple prompt requiring fast iteration - using Gemini Nano Banana for speed and cost efficiency';
    } else if (style === 'photorealistic' || requiresDetail) {
      recommendedModel = 'midjourney';
      reasoning = 'Photorealistic or highly detailed image - using Midjourney for best quality';
    } else if (style === 'artistic' || isAbstract) {
      recommendedModel = 'sdxl';
      reasoning = 'Artistic or creative style - using SDXL for versatile creative generation';
    } else {
      recommendedModel = 'gemini-nano-banana';
      reasoning = 'Fast and cost-effective generation - using Gemini Nano Banana as default for quick results';
    }

    return {
      isSimple,
      needsSpeed,
      style,
      requiresDetail,
      isAbstract,
      complexity,
      recommendedModel,
      reasoning,
    };
  }

  /**
   * Routes image generation to the optimal model
   */
  async routeImageGeneration(
    prompt: string,
    userSettings: UserModelPreferences,
    size: string = '1024x1024',
    quality: 'standard' | 'hd' = 'standard'
  ): Promise<RoutingDecision> {
    // Check user preference
    if (userSettings.imageModelPreference !== 'auto') {
      const costCents = this.calculateImageCost(
        userSettings.imageModelPreference,
        size,
        quality
      );

      return {
        selectedModel: userSettings.imageModelPreference,
        analysis: await this.analyzeImagePrompt(prompt),
        wasAutoRouted: false,
        overrideReason: 'User manually selected preferred image model',
        estimatedCostCents: costCents,
        reasoning: `Using user's preferred model: ${userSettings.imageModelPreference}`,
      };
    }

    // Analyze prompt to select best model
    const analysis = await this.analyzeImagePrompt(prompt);
    let selectedModel = analysis.recommendedModel;

    // Apply user style preference
    if (userSettings.imageStylePreference !== 'balanced') {
      if (userSettings.imageStylePreference === 'speed' && !analysis.requiresDetail) {
        selectedModel = 'gemini-nano-banana';
      } else if (userSettings.imageStylePreference === 'quality') {
        selectedModel = 'midjourney';
      } else if (userSettings.imageStylePreference === 'creative') {
        selectedModel = 'sdxl';
      }
    }

    // Calculate costs
    const selectedCost = this.calculateImageCost(selectedModel, size, quality);
    const defaultCost = this.calculateImageCost('gemini-nano-banana', size, quality);
    const savings = Math.max(0, defaultCost - selectedCost);

    return {
      selectedModel,
      analysis,
      wasAutoRouted: true,
      estimatedCostCents: selectedCost,
      estimatedSavingsCents: savings,
      reasoning: analysis.reasoning,
    };
  }

  /**
   * Calculates the cost for an image generation
   */
  private calculateImageCost(
    model: ImageModelType,
    size: string,
    quality: 'standard' | 'hd'
  ): number {
    const pricing = IMAGE_MODEL_PRICING[model];

    if (model === 'dalle3') {
      const isLarge = size.includes('1792');
      if (isLarge) return pricing.large * 100; // Convert to cents
      if (quality === 'hd') return pricing.hd * 100;
      return pricing.standard * 100;
    }

    return pricing.standard * 100; // Convert to cents
  }

  /**
   * Gets all available image models with their characteristics
   */
  getAvailableImageModels() {
    return [
      {
        id: 'gemini-nano-banana',
        name: 'Gemini Nano Banana',
        provider: 'Google',
        description: 'Fastest and cheapest - DEFAULT for quick results',
        strengths: ['Speed', 'Cost', 'Quick generation', 'Default choice'],
        bestFor: ['Quick drafts', 'Rapid iterations', 'General images', 'Fast prototypes'],
        speed: 'very fast',
        cost: '$0.005',
      },
      {
        id: 'sdxl',
        name: 'Stable Diffusion XL',
        provider: 'Stability AI',
        description: 'Versatile and creative, excellent for artistic styles',
        strengths: ['Artistic flexibility', 'Style control', 'Cost effective'],
        bestFor: ['Art', 'Creative concepts', 'Style variations'],
        speed: 'fast',
        cost: '$0.02',
      },
      {
        id: 'dalle3',
        name: 'DALL-E 3',
        provider: 'OpenAI',
        description: 'Balanced quality and capability, great for general use',
        strengths: ['Prompt understanding', 'Consistency', 'Text rendering'],
        bestFor: ['Product images', 'Marketing materials', 'General illustrations'],
        speed: 'moderate',
        cost: '$0.04 - $0.12',
      },
      {
        id: 'midjourney',
        name: 'Midjourney v6',
        provider: 'Midjourney',
        description: 'Highest quality, best for photorealism and fine details',
        strengths: ['Photorealism', 'Detail', 'Aesthetic quality'],
        bestFor: ['High-end marketing', 'Hero images', 'Premium content'],
        speed: 'slow',
        cost: '$0.10',
      },
    ];
  }

  /**
   * Validates an image prompt for potential issues
   */
  validatePrompt(prompt: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (prompt.length < 3) {
      issues.push('Prompt is too short. Provide more detail for better results.');
    }

    if (prompt.length > 1000) {
      issues.push('Prompt is too long. Keep it under 1000 characters.');
    }

    // Check for potentially prohibited content
    const prohibitedPatterns = [
      /violence|blood|gore|weapon/i,
      /nude|naked|nsfw/i,
      /celebrity|famous person/i,
    ];

    prohibitedPatterns.forEach((pattern, index) => {
      if (pattern.test(prompt)) {
        const category = ['violent', 'adult', 'celebrity'][index];
        issues.push(`Prompt may contain ${category} content which could be rejected by the AI provider.`);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Enhances a simple prompt with additional details
   */
  suggestPromptEnhancement(prompt: string, style: ImageStyleType): string {
    const styleEnhancements: Record<ImageStyleType, string> = {
      photorealistic: ', professional photography, high detail, 8k resolution, realistic lighting',
      artistic: ', artistic style, painted with attention to composition and color harmony',
      abstract: ', abstract art, creative interpretation, bold colors and shapes',
      illustration: ', digital illustration, clean lines, vibrant colors, professional artwork',
      sketch: ', pencil sketch, hand-drawn style, artistic linework, detailed shading',
      anime: ', anime style, detailed character art, vibrant colors, manga inspired',
      logo: ', logo design, clean and professional, vector style, simple and memorable',
      technical: ', technical diagram, precise and clear, professional schematic style',
    };

    return prompt + styleEnhancements[style];
  }
}

// Export singleton instance
export const imageRoutingEngine = new ImageRoutingEngine();

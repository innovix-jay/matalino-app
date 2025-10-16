import { ScaffoldRequest, ScaffoldResult, AppType, ProjectConfig } from '@/types/project';

/**
 * JcalAI Project Scaffolding Engine
 * 
 * This engine uses AI to analyze user prompts and generate complete project structures,
 * including pages, components, database schemas, and API endpoints.
 */

export class ProjectScaffoldingEngine {
  /**
   * Analyzes a user prompt to determine app type and features
   */
  async analyzePrompt(prompt: string): Promise<{
    appType: AppType;
    features: string[];
    suggestedTech: {
      framework: string;
      database: string;
      auth: boolean;
      payments: boolean;
    };
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedPages: number;
    reasoning: string;
  }> {
    const promptLower = prompt.toLowerCase();

    // Detect app type
    let appType: AppType = 'web';
    if (/dashboard|admin|analytics|crm/.test(promptLower)) {
      appType = 'dashboard';
    } else if (/shop|store|ecommerce|commerce|product|cart/.test(promptLower)) {
      appType = 'ecommerce';
    } else if (/saas|subscription|tenant|multi-tenant/.test(promptLower)) {
      appType = 'saas';
    } else if (/mobile|ios|android|app/.test(promptLower)) {
      appType = 'mobile';
    } else if (/automation|workflow|zapier|n8n/.test(promptLower)) {
      appType = 'automation';
    } else if (/ai|chatbot|gpt|llm|assistant/.test(promptLower)) {
      appType = 'ai_tool';
    } else if (/api|rest|graphql|endpoint/.test(promptLower)) {
      appType = 'api';
    }

    // Detect features
    const features: string[] = [];
    if (/auth|login|signup|user|account/.test(promptLower)) features.push('authentication');
    if (/payment|stripe|checkout|billing/.test(promptLower)) features.push('payments');
    if (/email|notification|notify/.test(promptLower)) features.push('email');
    if (/search/.test(promptLower)) features.push('search');
    if (/chat|message|messaging/.test(promptLower)) features.push('chat');
    if (/upload|file|image|photo/.test(promptLower)) features.push('file-upload');
    if (/analytics|track|report/.test(promptLower)) features.push('analytics');
    if (/api|integration/.test(promptLower)) features.push('api');
    if (/admin|dashboard/.test(promptLower)) features.push('admin-panel');
    if (/blog|post|article|content/.test(promptLower)) features.push('blog');

    // Determine complexity
    const wordCount = prompt.split(/\s+/).length;
    const featureCount = features.length;
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    
    if (wordCount > 50 || featureCount > 5) {
      complexity = 'complex';
    } else if (wordCount > 20 || featureCount > 2) {
      complexity = 'moderate';
    }

    // Suggest technology
    const suggestedTech = {
      framework: 'nextjs',
      database: features.includes('authentication') || features.includes('payments') ? 'supabase' : 'supabase',
      auth: features.includes('authentication'),
      payments: features.includes('payments'),
    };

    // Estimate pages
    let estimatedPages = 3; // Home, about, contact
    if (features.includes('authentication')) estimatedPages += 2; // Login, signup
    if (features.includes('admin-panel')) estimatedPages += 3; // Dashboard, settings, users
    if (features.includes('blog')) estimatedPages += 2; // Blog list, blog post
    if (features.includes('ecommerce')) estimatedPages += 4; // Products, cart, checkout, order
    
    const reasoning = `Detected ${appType} app with ${featureCount} features. ` +
      `Complexity: ${complexity}. Suggested ${suggestedTech.framework} with ${suggestedTech.database}. ` +
      `Estimated ${estimatedPages} pages needed.`;

    return {
      appType,
      features,
      suggestedTech,
      complexity,
      estimatedPages,
      reasoning,
    };
  }

  /**
   * Generates a complete project scaffold from a prompt
   */
  async scaffold(request: ScaffoldRequest): Promise<ScaffoldResult> {
    // Analyze the prompt
    const analysis = await this.analyzePrompt(request.prompt);

    // Generate project config
    const config: ProjectConfig = {
      framework: (request.targetFramework as any) || 'nextjs',
      styling: 'tailwindcss',
      database: analysis.suggestedTech.database as any,
      auth: request.includeAuth ?? analysis.suggestedTech.auth,
      api: true,
      responsive: true,
      darkMode: true,
      i18n: false,
    };

    // Generate project structure
    const project = {
      name: this.extractProjectName(request.prompt),
      description: request.prompt,
      app_type: request.appType || analysis.appType,
      config,
      ai_prompt: request.prompt,
      ai_metadata: {
        analysis,
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    // Generate pages based on app type and features
    const pages = this.generatePages(analysis.appType, analysis.features);

    // Generate components
    const components = this.generateComponents(analysis.appType, analysis.features);

    // Generate database schema if needed
    const databaseSchema = config.database !== 'none' 
      ? this.generateDatabaseSchema(analysis.appType, analysis.features)
      : undefined;

    // Generate API endpoints
    const apiEndpoints = this.generateAPIEndpoints(analysis.appType, analysis.features);

    // Generate integrations
    const integrations = this.generateIntegrations(analysis.features);

    // Calculate estimated cost (based on AI usage for generation)
    const estimatedCost = this.calculateGenerationCost(analysis.complexity, analysis.estimatedPages);

    return {
      project,
      pages,
      components,
      databaseSchema,
      apiEndpoints,
      integrations,
      reasoning: analysis.reasoning,
      estimatedCost,
    };
  }

  /**
   * Extracts a project name from the prompt
   */
  private extractProjectName(prompt: string): string {
    // Try to find app/project name in quotes
    const quotedMatch = prompt.match(/"([^"]+)"/);
    if (quotedMatch) return quotedMatch[1];

    // Try to find "called/named X" pattern
    const namedMatch = prompt.match(/(?:called|named)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (namedMatch) return namedMatch[1];

    // Extract first few words and capitalize
    const words = prompt.split(/\s+/).slice(0, 3);
    return words
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generates page structures based on app type and features
   */
  private generatePages(appType: AppType, features: string[]) {
    const pages: any[] = [];

    // Always include home page
    pages.push({
      name: 'Home',
      slug: 'home',
      path: '/',
      is_home: true,
      structure: this.generateHomePageStructure(appType),
    });

    // Add auth pages if needed
    if (features.includes('authentication')) {
      pages.push(
        {
          name: 'Login',
          slug: 'login',
          path: '/login',
          structure: this.generateLoginPageStructure(),
        },
        {
          name: 'Sign Up',
          slug: 'signup',
          path: '/signup',
          structure: this.generateSignupPageStructure(),
        }
      );
    }

    // Add dashboard for admin apps
    if (appType === 'dashboard' || features.includes('admin-panel')) {
      pages.push({
        name: 'Dashboard',
        slug: 'dashboard',
        path: '/dashboard',
        is_protected: true,
        structure: this.generateDashboardPageStructure(),
      });
    }

    // Add e-commerce pages
    if (appType === 'ecommerce') {
      pages.push(
        {
          name: 'Products',
          slug: 'products',
          path: '/products',
          structure: this.generateProductsPageStructure(),
        },
        {
          name: 'Cart',
          slug: 'cart',
          path: '/cart',
          structure: this.generateCartPageStructure(),
        }
      );
    }

    return pages;
  }

  /**
   * Generates component definitions
   */
  private generateComponents(appType: AppType, features: string[]) {
    const components: any[] = [];

    // Add common components
    components.push(
      {
        name: 'Header',
        component_type: 'navigation',
        structure: { type: 'Navbar' },
        description: 'Main navigation header',
      },
      {
        name: 'Footer',
        component_type: 'layout',
        structure: { type: 'Footer' },
        description: 'Site footer',
      }
    );

    // Add feature-specific components
    if (features.includes('authentication')) {
      components.push({
        name: 'LoginForm',
        component_type: 'form',
        structure: { type: 'Form' },
        description: 'User login form',
      });
    }

    if (appType === 'ecommerce') {
      components.push(
        {
          name: 'ProductCard',
          component_type: 'data_display',
          structure: { type: 'Card' },
          description: 'Product display card',
        },
        {
          name: 'CartItem',
          component_type: 'data_display',
          structure: { type: 'Container' },
          description: 'Shopping cart item',
        }
      );
    }

    return components;
  }

  /**
   * Generates database schema
   */
  private generateDatabaseSchema(appType: AppType, features: string[]) {
    const tables: any[] = [];
    const relationships: any[] = [];

    // Add user table if auth is needed
    if (features.includes('authentication')) {
      tables.push({
        id: 'users',
        name: 'users',
        columns: [
          { id: 'id', name: 'id', type: 'uuid', is_primary_key: true, nullable: false },
          { id: 'email', name: 'email', type: 'text', is_unique: true, nullable: false },
          { id: 'created_at', name: 'created_at', type: 'timestamp', nullable: false },
        ],
      });
    }

    // Add e-commerce tables
    if (appType === 'ecommerce') {
      tables.push(
        {
          id: 'products',
          name: 'products',
          columns: [
            { id: 'id', name: 'id', type: 'uuid', is_primary_key: true, nullable: false },
            { id: 'name', name: 'name', type: 'text', nullable: false },
            { id: 'price', name: 'price', type: 'decimal', nullable: false },
            { id: 'description', name: 'description', type: 'text', nullable: true },
            { id: 'image_url', name: 'image_url', type: 'text', nullable: true },
          ],
        },
        {
          id: 'orders',
          name: 'orders',
          columns: [
            { id: 'id', name: 'id', type: 'uuid', is_primary_key: true, nullable: false },
            { id: 'user_id', name: 'user_id', type: 'uuid', nullable: false, is_foreign_key: true, foreign_key_table: 'users', foreign_key_column: 'id' },
            { id: 'total', name: 'total', type: 'decimal', nullable: false },
            { id: 'status', name: 'status', type: 'text', nullable: false },
          ],
        }
      );

      relationships.push({
        id: 'orders_users',
        from_table: 'orders',
        from_column: 'user_id',
        to_table: 'users',
        to_column: 'id',
        relationship_type: 'many-to-one',
      });
    }

    return {
      name: 'Main Schema',
      tables,
      relationships,
    };
  }

  /**
   * Generates API endpoints
   */
  private generateAPIEndpoints(appType: AppType, features: string[]) {
    const endpoints: any[] = [];

    // Add auth endpoints
    if (features.includes('authentication')) {
      endpoints.push(
        {
          name: 'Register User',
          path: '/api/auth/register',
          method: 'POST',
          config: { auth: false },
        },
        {
          name: 'Login User',
          path: '/api/auth/login',
          method: 'POST',
          config: { auth: false },
        }
      );
    }

    // Add CRUD endpoints for main entities
    if (appType === 'ecommerce') {
      endpoints.push(
        {
          name: 'Get Products',
          path: '/api/products',
          method: 'GET',
          config: { auth: false },
        },
        {
          name: 'Create Order',
          path: '/api/orders',
          method: 'POST',
          config: { auth: true },
        }
      );
    }

    return endpoints;
  }

  /**
   * Generates integration configurations
   */
  private generateIntegrations(features: string[]) {
    const integrations: any[] = [];

    if (features.includes('payments')) {
      integrations.push({
        service_name: 'stripe',
        service_type: 'payment',
        config: {},
      });
    }

    if (features.includes('email')) {
      integrations.push({
        service_name: 'sendgrid',
        service_type: 'email',
        config: {},
      });
    }

    return integrations;
  }

  /**
   * Generates home page structure
   */
  private generateHomePageStructure(appType: AppType) {
    return {
      ROOT: {
        type: 'Container',
        nodes: ['hero', 'features', 'cta'],
        props: {},
      },
      hero: {
        type: 'Hero',
        props: {
          title: 'Welcome to Your App',
          subtitle: 'Build amazing things',
        },
      },
      features: {
        type: 'Grid',
        props: { columns: 3 },
        nodes: [],
      },
      cta: {
        type: 'Container',
        props: {},
        nodes: [],
      },
    };
  }

  private generateLoginPageStructure() {
    return {
      ROOT: {
        type: 'Container',
        nodes: ['loginForm'],
        props: { justifyContent: 'center', alignItems: 'center' },
      },
      loginForm: {
        type: 'Form',
        nodes: ['emailInput', 'passwordInput', 'submitButton'],
        props: {},
      },
    };
  }

  private generateSignupPageStructure() {
    return {
      ROOT: {
        type: 'Container',
        nodes: ['signupForm'],
        props: { justifyContent: 'center', alignItems: 'center' },
      },
      signupForm: {
        type: 'Form',
        nodes: ['nameInput', 'emailInput', 'passwordInput', 'submitButton'],
        props: {},
      },
    };
  }

  private generateDashboardPageStructure() {
    return {
      ROOT: {
        type: 'Container',
        nodes: ['navbar', 'statsGrid', 'recentActivity'],
        props: {},
      },
      statsGrid: {
        type: 'Grid',
        props: { columns: 4 },
        nodes: [],
      },
    };
  }

  private generateProductsPageStructure() {
    return {
      ROOT: {
        type: 'Container',
        nodes: ['productsGrid'],
        props: {},
      },
      productsGrid: {
        type: 'Grid',
        props: { columns: 3 },
        nodes: [],
      },
    };
  }

  private generateCartPageStructure() {
    return {
      ROOT: {
        type: 'Container',
        nodes: ['cartItems', 'cartSummary'],
        props: {},
      },
    };
  }

  /**
   * Calculates the cost of generating a project
   */
  private calculateGenerationCost(complexity: string, pageCount: number): number {
    const baseCost = 100; // cents
    const complexityMultiplier = complexity === 'complex' ? 3 : complexity === 'moderate' ? 2 : 1;
    const pageCost = pageCount * 20; // 20 cents per page

    return baseCost * complexityMultiplier + pageCost;
  }
}

// Export singleton instance
export const projectScaffoldingEngine = new ProjectScaffoldingEngine();


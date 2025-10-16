'use server';

import { createClient } from '@/lib/supabase/server';
import { Template, TemplateCategory, AppType } from '@/types/project';

/**
 * Gets all public templates
 */
export async function getTemplates(filters?: {
  category?: TemplateCategory;
  appType?: AppType;
  featured?: boolean;
}) {
  const supabase = createClient();

  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_public', true);

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.appType) {
    query = query.eq('app_type', filters.appType);
  }

  if (filters?.featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query.order('usage_count', { ascending: false });

  if (error) throw error;
  return data as Template[];
}

/**
 * Gets a single template by ID
 */
export async function getTemplate(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error) throw error;
  return data as Template;
}

/**
 * Creates a project from a template
 */
export async function createProjectFromTemplate(templateId: string, projectName?: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get template
  const template = await getTemplate(templateId);

  // Create project from template structure
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: projectName || template.name,
      description: template.description,
      app_type: template.app_type,
      config: template.project_structure,
    })
    .select()
    .single();

  if (projectError) throw projectError;

  // Create pages from template
  if (template.pages && Array.isArray(template.pages)) {
    const pagesWithProjectId = template.pages.map((page: any) => ({
      ...page,
      project_id: project.id,
    }));

    await supabase.from('pages').insert(pagesWithProjectId);
  }

  // Create components from template
  if (template.components && Array.isArray(template.components)) {
    const componentsWithIds = template.components.map((component: any) => ({
      ...component,
      project_id: project.id,
      user_id: user.id,
    }));

    await supabase.from('components').insert(componentsWithIds);
  }

  // Create database schema if exists
  if (template.database_schema) {
    await supabase.from('database_schemas').insert({
      ...template.database_schema,
      project_id: project.id,
    });
  }

  // Increment template usage count
  await supabase.rpc('increment_template_usage', { template_id: templateId });

  return project;
}

/**
 * Seeds default templates (to be run once)
 */
export async function seedDefaultTemplates() {
  const supabase = createClient();

  const defaultTemplates: Partial<Template>[] = [
    {
      name: 'SaaS Starter',
      description: 'Complete SaaS template with authentication, billing, and admin dashboard',
      category: 'saas',
      app_type: 'saas',
      is_public: true,
      is_featured: true,
      is_official: true,
      is_free: true,
      tags: ['saas', 'dashboard', 'auth', 'billing'],
      features: ['Authentication', 'Stripe Integration', 'Admin Dashboard', 'User Management'],
      project_structure: {},
      pages: [],
      components: [],
    },
    {
      name: 'E-commerce Store',
      description: 'Modern e-commerce template with product catalog, cart, and checkout',
      category: 'ecommerce',
      app_type: 'ecommerce',
      is_public: true,
      is_featured: true,
      is_official: true,
      is_free: true,
      tags: ['ecommerce', 'store', 'products', 'payments'],
      features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Order Management'],
      project_structure: {},
      pages: [],
      components: [],
    },
    {
      name: 'Admin Dashboard',
      description: 'Professional admin dashboard with analytics, charts, and data tables',
      category: 'dashboard',
      app_type: 'dashboard',
      is_public: true,
      is_featured: true,
      is_official: true,
      is_free: true,
      tags: ['dashboard', 'admin', 'analytics', 'charts'],
      features: ['Analytics Dashboard', 'Data Tables', 'Charts & Graphs', 'User Management'],
      project_structure: {},
      pages: [],
      components: [],
    },
    {
      name: 'Landing Page',
      description: 'High-converting landing page with hero, features, pricing, and testimonials',
      category: 'landing',
      app_type: 'web',
      is_public: true,
      is_featured: true,
      is_official: true,
      is_free: true,
      tags: ['landing', 'marketing', 'conversion'],
      features: ['Hero Section', 'Feature Grid', 'Pricing Table', 'Testimonials'],
      project_structure: {},
      pages: [],
      components: [],
    },
    {
      name: 'Blog Platform',
      description: 'Full-featured blog with posts, categories, tags, and comments',
      category: 'blog',
      app_type: 'web',
      is_public: true,
      is_featured: false,
      is_official: true,
      is_free: true,
      tags: ['blog', 'content', 'cms'],
      features: ['Post Management', 'Categories & Tags', 'Comments', 'SEO Optimized'],
      project_structure: {},
      pages: [],
      components: [],
    },
  ];

  const { data, error } = await supabase
    .from('templates')
    .insert(defaultTemplates)
    .select();

  if (error) throw error;
  return data;
}


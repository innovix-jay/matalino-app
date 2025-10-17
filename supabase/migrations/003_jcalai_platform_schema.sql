-- JcalAI No-Code Platform Schema
-- This migration adds tables for projects, apps, components, templates, and deployments

-- Create custom types for the platform
CREATE TYPE app_type AS ENUM ('web', 'mobile', 'automation', 'ai_tool', 'api', 'dashboard', 'ecommerce', 'saas', 'custom');
CREATE TYPE component_type AS ENUM ('layout', 'form', 'data_display', 'navigation', 'input', 'feedback', 'utility', 'custom');
CREATE TYPE deployment_status AS ENUM ('pending', 'building', 'deploying', 'deployed', 'failed', 'stopped');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'archived', 'deleted');
CREATE TYPE template_category AS ENUM ('dashboard', 'ecommerce', 'saas', 'landing', 'blog', 'portfolio', 'admin', 'crm', 'marketplace', 'learning');

-- Projects table - main container for each app/project
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  app_type app_type DEFAULT 'web',
  status project_status DEFAULT 'draft',
  thumbnail_url TEXT,
  
  -- Project configuration
  config JSONB DEFAULT '{
    "framework": "nextjs",
    "styling": "tailwindcss",
    "database": "supabase",
    "auth": true,
    "api": true
  }',
  
  -- AI generation metadata
  ai_prompt TEXT, -- Original user prompt
  ai_metadata JSONB DEFAULT '{}', -- AI decisions and reasoning
  
  -- Version control
  version INTEGER DEFAULT 1,
  git_repo_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0
);

-- Pages table - individual pages within a project
CREATE TABLE public.pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  path TEXT NOT NULL, -- e.g., /dashboard, /products/:id
  
  -- Page structure as JSON (Craft.js compatible)
  structure JSONB DEFAULT '{"ROOT": {"type": "Container", "nodes": [], "props": {}}}',
  
  -- Page metadata
  title TEXT,
  description TEXT,
  meta_tags JSONB DEFAULT '{}',
  
  -- Configuration
  is_home BOOLEAN DEFAULT false,
  is_protected BOOLEAN DEFAULT false, -- Requires auth
  layout_id UUID, -- References a layout component
  
  -- Order and visibility
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, slug)
);

-- Components table - reusable UI components
CREATE TABLE public.components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  component_type component_type DEFAULT 'custom',
  
  -- Component code/structure
  structure JSONB NOT NULL, -- Craft.js node structure
  props_schema JSONB DEFAULT '{}', -- JSON Schema for component props
  
  -- Code generation
  generated_code TEXT, -- React/Vue/etc code
  styles TEXT, -- CSS/Tailwind classes
  
  -- Categorization
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  
  -- Visibility
  is_public BOOLEAN DEFAULT false, -- Can be shared/used by others
  is_template BOOLEAN DEFAULT false,
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Database schemas table - visual database designer
CREATE TABLE public.database_schemas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  
  -- Schema definition
  tables JSONB DEFAULT '[]', -- Array of table definitions
  relationships JSONB DEFAULT '[]', -- Foreign keys and relations
  
  -- Generated SQL
  migration_sql TEXT,
  rollback_sql TEXT,
  
  -- Status
  is_applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API endpoints table - visual API builder
CREATE TABLE public.api_endpoints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  path TEXT NOT NULL, -- e.g., /api/users/:id
  method TEXT NOT NULL, -- GET, POST, PUT, DELETE, PATCH
  
  -- Configuration
  config JSONB DEFAULT '{
    "auth": false,
    "rateLimit": 100,
    "validation": {},
    "middleware": []
  }',
  
  -- Handler logic (visual flow or code)
  handler_type TEXT DEFAULT 'visual', -- 'visual' or 'code'
  handler_flow JSONB DEFAULT '{}', -- Visual flow definition
  handler_code TEXT, -- Custom code if needed
  
  -- Documentation
  description TEXT,
  request_schema JSONB,
  response_schema JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, path, method)
);

-- Integrations table - third-party service connections
CREATE TABLE public.integrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  
  service_name TEXT NOT NULL, -- 'stripe', 'sendgrid', 'twilio', etc.
  service_type TEXT NOT NULL, -- 'payment', 'email', 'sms', 'storage', etc.
  
  -- Configuration (encrypted in production)
  config JSONB DEFAULT '{}',
  api_keys JSONB DEFAULT '{}', -- Encrypted
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_configured BOOLEAN DEFAULT false,
  
  -- Usage tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  request_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table - pre-built project templates
CREATE TABLE public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  category template_category NOT NULL,
  app_type app_type DEFAULT 'web',
  
  -- Template content
  thumbnail_url TEXT,
  preview_url TEXT,
  
  -- Full project structure
  project_structure JSONB NOT NULL,
  pages JSONB DEFAULT '[]',
  components JSONB DEFAULT '[]',
  database_schema JSONB,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  
  -- Visibility
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT false, -- Created by JcalAI team
  
  -- Pricing
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2) DEFAULT 0,
  
  -- Stats
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deployments table - deployment history and management
CREATE TABLE public.deployments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  
  -- Deployment target
  platform TEXT NOT NULL, -- 'vercel', 'netlify', 'aws', 'custom'
  environment TEXT DEFAULT 'production', -- 'production', 'staging', 'preview'
  
  -- Status
  status deployment_status DEFAULT 'pending',
  
  -- URLs
  deploy_url TEXT,
  custom_domain TEXT,
  
  -- Build info
  build_id TEXT,
  build_log TEXT,
  
  -- Version
  commit_sha TEXT,
  version TEXT,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- AI generations table - track AI-generated content for projects
CREATE TABLE public.ai_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  
  -- Generation details
  prompt TEXT NOT NULL,
  generation_type TEXT NOT NULL, -- 'scaffold', 'component', 'page', 'api', 'database'
  
  -- AI metadata
  model_used TEXT,
  tokens_used INTEGER,
  cost_cents INTEGER,
  
  -- Output
  output JSONB,
  code_generated TEXT,
  
  -- Quality
  was_accepted BOOLEAN,
  user_rating INTEGER, -- 1-5
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration table - team access and permissions
CREATE TABLE public.project_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT DEFAULT 'viewer', -- 'owner', 'editor', 'viewer'
  permissions JSONB DEFAULT '{
    "read": true,
    "write": false,
    "deploy": false,
    "invite": false
  }',
  
  invited_by UUID REFERENCES public.profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(project_id, user_id)
);

-- Activity log table - track all project changes
CREATE TABLE public.project_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  activity_type TEXT NOT NULL, -- 'created', 'updated', 'deployed', 'shared'
  entity_type TEXT, -- 'page', 'component', 'api', 'database'
  entity_id UUID,
  
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_app_type ON public.projects(app_type);

CREATE INDEX idx_pages_project_id ON public.pages(project_id);
CREATE INDEX idx_pages_slug ON public.pages(project_id, slug);

CREATE INDEX idx_components_project_id ON public.components(project_id);
CREATE INDEX idx_components_user_id ON public.components(user_id);
CREATE INDEX idx_components_type ON public.components(component_type);
CREATE INDEX idx_components_public ON public.components(is_public) WHERE is_public = true;

CREATE INDEX idx_database_schemas_project_id ON public.database_schemas(project_id);

CREATE INDEX idx_api_endpoints_project_id ON public.api_endpoints(project_id);

CREATE INDEX idx_integrations_project_id ON public.integrations(project_id);
CREATE INDEX idx_integrations_active ON public.integrations(is_active) WHERE is_active = true;

CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_featured ON public.templates(is_featured) WHERE is_featured = true;
CREATE INDEX idx_templates_public ON public.templates(is_public) WHERE is_public = true;

CREATE INDEX idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX idx_deployments_status ON public.deployments(status);

CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_project_id ON public.ai_generations(project_id);

CREATE INDEX idx_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX idx_collaborators_user_id ON public.project_collaborators(user_id);

CREATE INDEX idx_activity_project_id ON public.project_activity(project_id);
CREATE INDEX idx_activity_created_at ON public.project_activity(created_at DESC);

-- Add updated_at triggers to new tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_database_schemas_updated_at BEFORE UPDATE ON public.database_schemas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON public.api_endpoints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.database_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be added in the next migration



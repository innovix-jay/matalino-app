// JcalAI Project & Platform Types

export type AppType = 
  | 'web' 
  | 'mobile' 
  | 'automation' 
  | 'ai_tool' 
  | 'api' 
  | 'dashboard' 
  | 'ecommerce' 
  | 'saas' 
  | 'custom';

export type ProjectStatus = 'draft' | 'active' | 'archived' | 'deleted';

export type ComponentType = 
  | 'layout' 
  | 'form' 
  | 'data_display' 
  | 'navigation' 
  | 'input' 
  | 'feedback' 
  | 'utility' 
  | 'custom';

export type DeploymentStatus = 
  | 'pending' 
  | 'building' 
  | 'deploying' 
  | 'deployed' 
  | 'failed' 
  | 'stopped';

export type TemplateCategory = 
  | 'dashboard' 
  | 'ecommerce' 
  | 'saas' 
  | 'landing' 
  | 'blog' 
  | 'portfolio' 
  | 'admin' 
  | 'crm' 
  | 'marketplace' 
  | 'learning';

export interface ProjectConfig {
  framework: 'nextjs' | 'react' | 'vue' | 'svelte' | 'angular';
  styling: 'tailwindcss' | 'css-modules' | 'styled-components' | 'emotion';
  database: 'supabase' | 'firebase' | 'postgres' | 'mongodb' | 'mysql';
  auth: boolean;
  api: boolean;
  responsive: boolean;
  darkMode: boolean;
  i18n: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  app_type: AppType;
  status: ProjectStatus;
  thumbnail_url?: string;
  config: ProjectConfig;
  ai_prompt?: string;
  ai_metadata?: Record<string, any>;
  version: number;
  git_repo_url?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count: number;
  clone_count: number;
}

export interface Page {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  path: string;
  structure: Record<string, any>; // Craft.js node tree
  title?: string;
  description?: string;
  meta_tags?: Record<string, any>;
  is_home: boolean;
  is_protected: boolean;
  layout_id?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  project_id?: string;
  user_id: string;
  name: string;
  description?: string;
  component_type: ComponentType;
  structure: Record<string, any>; // Craft.js structure
  props_schema?: Record<string, any>; // JSON Schema
  generated_code?: string;
  styles?: string;
  tags: string[];
  category?: string;
  is_public: boolean;
  is_template: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  id: string;
  project_id: string;
  name: string;
  tables: TableDefinition[];
  relationships: Relationship[];
  migration_sql?: string;
  rollback_sql?: string;
  is_applied: boolean;
  applied_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TableDefinition {
  id: string;
  name: string;
  columns: ColumnDefinition[];
  indexes: IndexDefinition[];
  position?: { x: number; y: number }; // For visual designer
}

export interface ColumnDefinition {
  id: string;
  name: string;
  type: string; // 'text', 'integer', 'uuid', 'timestamp', etc.
  nullable: boolean;
  default_value?: string;
  is_primary_key: boolean;
  is_unique: boolean;
  is_foreign_key: boolean;
  foreign_key_table?: string;
  foreign_key_column?: string;
}

export interface IndexDefinition {
  id: string;
  name: string;
  columns: string[];
  is_unique: boolean;
}

export interface Relationship {
  id: string;
  from_table: string;
  from_column: string;
  to_table: string;
  to_column: string;
  relationship_type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface APIEndpoint {
  id: string;
  project_id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  config: {
    auth: boolean;
    rateLimit: number;
    validation: Record<string, any>;
    middleware: string[];
  };
  handler_type: 'visual' | 'code';
  handler_flow?: Record<string, any>;
  handler_code?: string;
  description?: string;
  request_schema?: Record<string, any>;
  response_schema?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  project_id: string;
  service_name: string;
  service_type: string;
  config: Record<string, any>;
  api_keys?: Record<string, any>;
  is_active: boolean;
  is_configured: boolean;
  last_used_at?: string;
  request_count: number;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  creator_id?: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  app_type: AppType;
  thumbnail_url?: string;
  preview_url?: string;
  project_structure: Record<string, any>;
  pages: any[];
  components: any[];
  database_schema?: any;
  tags: string[];
  features: string[];
  is_public: boolean;
  is_featured: boolean;
  is_official: boolean;
  is_free: boolean;
  price: number;
  usage_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  platform: 'vercel' | 'netlify' | 'aws' | 'custom';
  environment: 'production' | 'staging' | 'preview';
  status: DeploymentStatus;
  deploy_url?: string;
  custom_domain?: string;
  build_id?: string;
  build_log?: string;
  commit_sha?: string;
  version?: string;
  started_at: string;
  completed_at?: string;
  metadata?: Record<string, any>;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  project_id?: string;
  prompt: string;
  generation_type: 'scaffold' | 'component' | 'page' | 'api' | 'database';
  model_used?: string;
  tokens_used?: number;
  cost_cents?: number;
  output?: Record<string, any>;
  code_generated?: string;
  was_accepted?: boolean;
  user_rating?: number;
  created_at: string;
}

export interface ProjectCollaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: {
    read: boolean;
    write: boolean;
    deploy: boolean;
    invite: boolean;
  };
  invited_by?: string;
  invited_at: string;
  accepted_at?: string;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id?: string;
  activity_type: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Visual Editor Types
export interface EditorNode {
  id: string;
  type: string;
  props: Record<string, any>;
  nodes: string[]; // Child node IDs
  parent?: string;
  linkedNodes?: Record<string, string>;
  hidden?: boolean;
  isCanvas?: boolean;
  displayName?: string;
  custom?: Record<string, any>;
}

export interface EditorState {
  nodes: Record<string, EditorNode>;
  events: {
    selected: Set<string>;
    dragged: Set<string>;
    hovered: Set<string>;
  };
  options: {
    enabled: boolean;
  };
}

// Project Scaffolding Types
export interface ScaffoldRequest {
  prompt: string;
  appType?: AppType;
  features?: string[];
  targetFramework?: string;
  includeAuth?: boolean;
  includeDatabase?: boolean;
  includePayments?: boolean;
}

export interface ScaffoldResult {
  project: Partial<Project>;
  pages: Partial<Page>[];
  components: Partial<Component>[];
  databaseSchema?: Partial<DatabaseSchema>;
  apiEndpoints?: Partial<APIEndpoint>[];
  integrations?: Partial<Integration>[];
  reasoning: string;
  estimatedCost: number;
}



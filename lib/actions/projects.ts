'use server';

import { createClient } from '@/lib/supabase/server';
import { Project, Page, Component, ScaffoldRequest } from '@/types/project';
import { projectScaffoldingEngine } from '@/lib/ai/project-scaffolding-engine';

/**
 * Creates a new project from scratch or from a template
 */
export async function createProject(data: Partial<Project>) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return project;
}

/**
 * AI-powered project scaffolding - creates a complete project from a prompt
 */
export async function scaffoldProjectFromPrompt(request: ScaffoldRequest) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Use AI to generate project structure
  const scaffold = await projectScaffoldingEngine.scaffold(request);

  // Create the project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      ...scaffold.project,
      user_id: user.id,
    })
    .select()
    .single();

  if (projectError) throw projectError;

  // Create pages
  if (scaffold.pages && scaffold.pages.length > 0) {
    const pagesWithProjectId = scaffold.pages.map(page => ({
      ...page,
      project_id: project.id,
    }));

    const { error: pagesError } = await supabase
      .from('pages')
      .insert(pagesWithProjectId);

    if (pagesError) console.error('Error creating pages:', pagesError);
  }

  // Create components
  if (scaffold.components && scaffold.components.length > 0) {
    const componentsWithIds = scaffold.components.map(component => ({
      ...component,
      project_id: project.id,
      user_id: user.id,
    }));

    const { error: componentsError } = await supabase
      .from('components')
      .insert(componentsWithIds);

    if (componentsError) console.error('Error creating components:', componentsError);
  }

  // Create database schema
  if (scaffold.databaseSchema) {
    const { error: schemaError } = await supabase
      .from('database_schemas')
      .insert({
        ...scaffold.databaseSchema,
        project_id: project.id,
      });

    if (schemaError) console.error('Error creating database schema:', schemaError);
  }

  // Create API endpoints
  if (scaffold.apiEndpoints && scaffold.apiEndpoints.length > 0) {
    const endpointsWithProjectId = scaffold.apiEndpoints.map(endpoint => ({
      ...endpoint,
      project_id: project.id,
    }));

    const { error: endpointsError } = await supabase
      .from('api_endpoints')
      .insert(endpointsWithProjectId);

    if (endpointsError) console.error('Error creating API endpoints:', endpointsError);
  }

  // Create integrations
  if (scaffold.integrations && scaffold.integrations.length > 0) {
    const integrationsWithProjectId = scaffold.integrations.map(integration => ({
      ...integration,
      project_id: project.id,
    }));

    const { error: integrationsError } = await supabase
      .from('integrations')
      .insert(integrationsWithProjectId);

    if (integrationsError) console.error('Error creating integrations:', integrationsError);
  }

  // Log AI generation
  await supabase.from('ai_generations').insert({
    user_id: user.id,
    project_id: project.id,
    prompt: request.prompt,
    generation_type: 'scaffold',
    output: scaffold,
    was_accepted: true,
  });

  return {
    project,
    scaffold,
  };
}

/**
 * Gets all projects for the current user
 */
export async function getProjects() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Project[];
}

/**
 * Gets a single project by ID
 */
export async function getProject(id: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data as Project;
}

/**
 * Updates a project
 */
export async function updateProject(id: string, updates: Partial<Project>) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

/**
 * Deletes a project
 */
export async function deleteProject(id: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

/**
 * Gets all pages for a project
 */
export async function getProjectPages(projectId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as Page[];
}

/**
 * Creates a new page
 */
export async function createPage(page: Partial<Page>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pages')
    .insert(page)
    .select()
    .single();

  if (error) throw error;
  return data as Page;
}

/**
 * Updates a page
 */
export async function updatePage(id: string, updates: Partial<Page>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Page;
}

/**
 * Saves page structure (from editor)
 */
export async function savePageStructure(pageId: string, structure: Record<string, any>) {
  return updatePage(pageId, { structure });
}


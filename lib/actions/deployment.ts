'use server';

import { createClient } from '@/lib/supabase/server';
import { getProject, getProjectPages } from './projects';
import { codeGenerator } from '@/lib/export/code-generator';
import { deploymentManager } from '@/lib/deployment/deployment-manager';

/**
 * Exports project code as downloadable files
 */
export async function exportProjectCode(projectId: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get project data
  const project = await getProject(projectId);
  const pages = await getProjectPages(projectId);

  // Get components
  const { data: components } = await supabase
    .from('components')
    .select('*')
    .eq('project_id', projectId);

  // Generate code
  const { files, structure } = await codeGenerator.generateProject(
    project,
    pages,
    components || []
  );

  return {
    files,
    structure,
    projectName: project.name,
  };
}

/**
 * Deploys a project to a platform
 */
export async function deployProject(
  projectId: string,
  platform: 'vercel' | 'netlify' | 'custom',
  config?: Record<string, any>
) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const project = await getProject(projectId);

  // Create deployment record
  const { data: deployment, error } = await supabase
    .from('deployments')
    .insert({
      project_id: projectId,
      platform,
      environment: 'production',
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // In a real implementation, this would trigger actual deployment
  // For now, we'll just update the status

  return deployment;
}

/**
 * Gets all deployments for a project
 */
export async function getProjectDeployments(projectId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('deployments')
    .select('*')
    .eq('project_id', projectId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Gets deployment logs
 */
export async function getDeploymentLogs(deploymentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('deployments')
    .select('build_log')
    .eq('id', deploymentId)
    .single();

  if (error) throw error;
  return data?.build_log || '';
}


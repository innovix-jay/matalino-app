'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EditorCanvas } from '@/components/builder/editor-canvas';
import { getProject, getProjectPages, savePageStructure } from '@/lib/actions/projects';
import { Project, Page } from '@/types/project';

export default function BuilderPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const [projectData, pagesData] = await Promise.all([
        getProject(projectId),
        getProjectPages(projectId),
      ]);

      setProject(projectData);
      setPages(pagesData);
      
      // Set the first page or home page as current
      const homePage = pagesData.find(p => p.is_home) || pagesData[0];
      setCurrentPage(homePage);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (state: Record<string, any>) => {
    if (!currentPage) return;

    try {
      await savePageStructure(currentPage.id, state);
      console.log('Page saved successfully');
      // Show success message
    } catch (error) {
      console.error('Failed to save page:', error);
      // Show error message
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading builder...</p>
        </div>
      </div>
    );
  }

  if (!project || !currentPage) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-gray-300">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <EditorCanvas
      projectId={projectId}
      pageId={currentPage.id}
      initialState={currentPage.structure}
      onSave={handleSave}
    />
  );
}


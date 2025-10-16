'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Workflow, 
  Bot,
  MoreVertical,
  Eye,
  Code,
  Trash2,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { getProjects } from '@/lib/actions/projects';
import { Project } from '@/types/project';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const appTypeIcons = {
    web: Globe,
    mobile: Smartphone,
    automation: Workflow,
    ai_tool: Bot,
    api: Code,
    dashboard: Settings,
    ecommerce: Globe,
    saas: Globe,
    custom: Sparkles,
  };

  const appTypeColors = {
    web: 'bg-blue-100 text-blue-700',
    mobile: 'bg-purple-100 text-purple-700',
    automation: 'bg-green-100 text-green-700',
    ai_tool: 'bg-orange-100 text-orange-700',
    api: 'bg-gray-100 text-gray-700',
    dashboard: 'bg-cyan-100 text-cyan-700',
    ecommerce: 'bg-pink-100 text-pink-700',
    saas: 'bg-violet-100 text-violet-700',
    custom: 'bg-yellow-100 text-yellow-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Build and manage your apps
              </p>
            </div>
            <Link href="/dashboard/projects/new">
              <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Create with AI
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-900/20 dark:to-cyan-900/20 flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-violet-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your First App
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Use AI to build a complete app in minutes. Just describe what you want to build.
            </p>
            <Link href="/dashboard/projects/new">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Building
              </Button>
            </Link>
          </div>
        ) : (
          // Projects grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const Icon = appTypeIcons[project.app_type];
              const colorClass = appTypeColors[project.app_type];

              return (
                <Card 
                  key={project.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="group-hover:text-violet-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {project.app_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/builder/${project.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Code className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>v{project.version}</span>
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


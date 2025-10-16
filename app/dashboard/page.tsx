'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Code2, 
  Layers, 
  Rocket,
  Plus,
  TrendingUp,
  Zap,
  Globe,
  ArrowRight,
  Database,
  Box
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { getProjects } from '@/lib/actions/projects';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    deployments: 0,
    components: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      const projects = await getProjects();
      setRecentProjects(projects.slice(0, 3));
      setStats({
        projects: projects.length,
        deployments: 0, // TODO: Fetch from deployments
        components: 0, // TODO: Fetch from components
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-violet-600" />
                <Zap className="h-4 w-4 text-cyan-500 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">JcalAI</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">by Innovix Dynamix</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
              <Link href="/dashboard/templates">
                <Button variant="ghost">Templates</Button>
              </Link>
              <Link href="/dashboard/projects/new">
                <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            What would you like to build today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Projects</CardTitle>
              <Code2 className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.projects}</div>
              <p className="text-xs opacity-75 mt-1">
                {stats.projects === 0 ? 'Create your first app' : 'Active apps'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Deployments</CardTitle>
              <Rocket className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.deployments}</div>
              <p className="text-xs opacity-75 mt-1">Live applications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Components</CardTitle>
              <Layers className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.components}</div>
              <p className="text-xs opacity-75 mt-1">Reusable components</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/projects/new">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-violet-200 dark:hover:border-violet-800">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-violet-600 transition-colors">
                  Create with AI
                </CardTitle>
                <CardDescription>
                  Describe your app and let AI build it in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20">
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/templates">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-cyan-200 dark:hover:border-cyan-800">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-cyan-600 transition-colors">
                  Browse Templates
                </CardTitle>
                <CardDescription>
                  Start with a pre-built template and customize
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20">
                  Explore <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/projects">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors">
                  My Projects
                </CardTitle>
                <CardDescription>
                  View and manage all your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
              <Link href="/dashboard/projects">
                <Button variant="ghost">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {project.app_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/builder/${project.id}`}>
                      <Button variant="outline" className="w-full">
                        <Code2 className="h-4 w-4 mr-2" />
                        Open in Builder
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Learning Resources */}
        <Card className="mt-8 bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0">
          <CardContent className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">New to JcalAI?</h3>
                <p className="opacity-90 mb-4 max-w-xl">
                  Watch our quick tutorial to learn how to build your first app in minutes
                </p>
                <Button variant="secondary">
                  Watch Tutorial <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="hidden lg:block">
                <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-12 w-12" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

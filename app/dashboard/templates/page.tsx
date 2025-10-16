'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Star, 
  Eye,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { getTemplates, createProjectFromTemplate } from '@/lib/actions/templates';
import { Template } from '@/types/project';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadTemplates();
  }, [filter]);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates(
        filter === 'featured' ? { featured: true } : undefined
      );
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    try {
      const project = await createProjectFromTemplate(templateId);
      router.push(`/builder/${project.id}`);
    } catch (error) {
      console.error('Failed to create project from template:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Templates</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Start with a pre-built template and customize to your needs
              </p>
            </div>
            <Link href="/dashboard/projects/new">
              <Button variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Create from Scratch
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'featured' ? 'default' : 'outline'}
              onClick={() => setFilter('featured')}
            >
              <Star className="h-4 w-4 mr-2" />
              Featured
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        {filter === 'all' && templates.filter(t => t.is_featured).length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Templates
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter(t => t.is_featured)
                .slice(0, 3)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => handleUseTemplate(template.id)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {filter === 'featured' ? 'Featured' : 'All'} Templates ({templates.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={() => handleUseTemplate(template.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ 
  template, 
  onUse 
}: { 
  template: Template; 
  onUse: () => void;
}) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 group">
      {template.thumbnail_url && (
        <div className="aspect-video bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-900/20 dark:to-cyan-900/20 rounded-t-lg overflow-hidden">
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="group-hover:text-violet-600 transition-colors">
            {template.name}
          </CardTitle>
          {template.is_featured && (
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Features */}
        <div className="mb-4 space-y-1">
          {template.features.slice(0, 3).map((feature) => (
            <div key={feature} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-violet-500" />
              {feature}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={onUse} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Use Template
          </Button>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
          <span>{template.usage_count} uses</span>
          {template.is_free ? (
            <Badge variant="outline" className="text-xs">Free</Badge>
          ) : (
            <span className="font-semibold">${template.price}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


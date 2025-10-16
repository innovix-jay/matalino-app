'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Globe,
  Smartphone,
  Workflow,
  Bot,
  Code,
  ShoppingCart,
  LayoutDashboard,
  Layers
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { scaffoldProjectFromPrompt } from '@/lib/actions/projects';
import { useRouter } from 'next/navigation';
import { AppType } from '@/types/project';

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<'prompt' | 'generating' | 'complete'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<AppType | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProject, setGeneratedProject] = useState<any>(null);

  const appTypes = [
    { 
      type: 'web' as AppType, 
      icon: Globe, 
      label: 'Web App', 
      description: 'Build web applications and websites',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      type: 'mobile' as AppType, 
      icon: Smartphone, 
      label: 'Mobile App', 
      description: 'Create mobile applications',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      type: 'dashboard' as AppType, 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      description: 'Admin panels and analytics dashboards',
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      type: 'ecommerce' as AppType, 
      icon: ShoppingCart, 
      label: 'E-commerce', 
      description: 'Online stores and marketplaces',
      color: 'from-pink-500 to-pink-600'
    },
    { 
      type: 'saas' as AppType, 
      icon: Layers, 
      label: 'SaaS', 
      description: 'Software as a Service platforms',
      color: 'from-violet-500 to-violet-600'
    },
    { 
      type: 'automation' as AppType, 
      icon: Workflow, 
      label: 'Automation', 
      description: 'Workflows and integrations',
      color: 'from-green-500 to-green-600'
    },
    { 
      type: 'ai_tool' as AppType, 
      icon: Bot, 
      label: 'AI Tool', 
      description: 'AI-powered applications',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      type: 'api' as AppType, 
      icon: Code, 
      label: 'API', 
      description: 'REST or GraphQL APIs',
      color: 'from-gray-500 to-gray-600'
    },
  ];

  const examplePrompts = [
    "Build a task management app with teams, projects, and time tracking",
    "Create an e-commerce store for handmade crafts with Stripe integration",
    "Build a SaaS platform for managing social media content with scheduling",
    "Create a fitness tracking app with workout plans and progress charts",
    "Build an AI-powered content generator with multiple LLM options",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStep('generating');
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const result = await scaffoldProjectFromPrompt({
        prompt,
        appType: selectedType || undefined,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGeneratedProject(result);

      setTimeout(() => {
        setStep('complete');
      }, 500);
    } catch (error) {
      console.error('Failed to generate project:', error);
      clearInterval(progressInterval);
      setStep('prompt');
      // Show error message
    }
  };

  const handleOpenProject = () => {
    if (generatedProject?.project?.id) {
      router.push(`/builder/${generatedProject.project.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {step === 'prompt' && (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-violet-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                  Create with AI
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Describe your app and let AI build it for you in seconds
              </p>
            </div>

            {/* App Type Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What type of app do you want to build?</CardTitle>
                <CardDescription>
                  Choose a category or skip to let AI decide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {appTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.type}
                        onClick={() => setSelectedType(type.type)}
                        className={`
                          p-4 rounded-xl border-2 transition-all text-left
                          ${selectedType === type.type
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800'
                          }
                        `}
                      >
                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${type.color} mb-2`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="font-semibold text-sm mb-1">{type.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {type.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Prompt Input */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Describe Your App
                </CardTitle>
                <CardDescription>
                  Be as detailed as possible. Include features, design preferences, and any specific requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Example: Build a modern task management app with team collaboration, time tracking, and project boards. Include user authentication, email notifications, and a clean dashboard with analytics. Use a blue and white color scheme."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] text-base"
                />

                {/* Example Prompts */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(example)}
                        className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 transition-colors text-left"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-lg px-12 py-6"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate My App
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Generation typically takes 10-30 seconds
              </p>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-900/20 dark:to-cyan-900/20 flex items-center justify-center mb-6">
                    <Loader2 className="h-10 w-10 text-violet-600 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    AI is Building Your App...
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Creating pages, components, database schema, and API endpoints
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    {[
                      { label: 'Analyzing requirements', threshold: 20 },
                      { label: 'Generating project structure', threshold: 40 },
                      { label: 'Creating pages and components', threshold: 60 },
                      { label: 'Setting up database schema', threshold: 80 },
                      { label: 'Finalizing configuration', threshold: 100 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 transition-opacity ${
                          generationProgress >= item.threshold ? 'opacity-100' : 'opacity-30'
                        }`}
                      >
                        {generationProgress >= item.threshold ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'complete' && generatedProject && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-green-500">
              <CardContent className="py-12">
                <div className="text-center mb-8">
                  <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Your App is Ready!
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {generatedProject.project.name}
                  </p>
                </div>

                {/* Generated Details */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-3xl font-bold text-blue-600">
                      {generatedProject.scaffold.pages?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pages</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="text-3xl font-bold text-purple-600">
                      {generatedProject.scaffold.components?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Components</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-3xl font-bold text-green-600">
                      {generatedProject.scaffold.apiEndpoints?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">API Endpoints</div>
                  </div>
                </div>

                {/* AI Reasoning */}
                {generatedProject.scaffold.reasoning && (
                  <div className="mb-8 p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <h3 className="font-semibold text-sm text-violet-900 dark:text-violet-100 mb-2">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {generatedProject.scaffold.reasoning}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={handleOpenProject}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
                  >
                    <Code className="h-5 w-5 mr-2" />
                    Open in Builder
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/dashboard/projects')}
                    className="flex-1"
                  >
                    View All Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


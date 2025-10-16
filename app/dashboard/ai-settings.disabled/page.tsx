import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelSettingsPanel } from '@/components/ai/model-settings-panel';
import { AIChat } from '@/components/ai/ai-chat';
import { UsageAnalyticsDashboard } from '@/components/ai/usage-analytics-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AISettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Assistant Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your AI preferences, manage conversations, and view usage analytics
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="models">Model Settings</TabsTrigger>
          <TabsTrigger value="usage">Usage & Costs</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Chat Assistant</CardTitle>
              <CardDescription>
                Have a conversation with our AI assistant. It will automatically select the best
                model based on your task and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIChat context={{ location: 'global' }} className="h-[600px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Preferences</CardTitle>
              <CardDescription>
                Configure which AI models to use and how they should be selected for different tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModelSettingsPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <UsageAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Manage your API keys and provider settings for OpenAI, Anthropic, and Google AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">OpenAI</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    GPT-5 and other OpenAI models are available
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">Anthropic</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Claude Sonnet 4.5 and other Claude models are available
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">Google AI</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Gemini 2.5 Pro and Flash models are available
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  API keys are configured via environment variables. Contact your administrator to
                  update provider credentials.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

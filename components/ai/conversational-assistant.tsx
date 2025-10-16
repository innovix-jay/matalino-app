'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  MessageSquare,
  Code,
  Smartphone,
  Palette,
  Database,
  Globe,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  codeSnippet?: string;
  attachments?: {
    type: 'image' | 'component' | 'screen';
    url: string;
    name: string;
  }[];
}

interface ConversationalAssistantProps {
  projectId?: string;
  onActionGenerated?: (action: any) => void;
}

export function ConversationalAssistant({ 
  projectId, 
  onActionGenerated 
}: ConversationalAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you build your app by chatting. What would you like to create today?",
      timestamp: new Date(),
      suggestions: [
        'Build a mobile app for my restaurant',
        'Create a fitness tracking app',
        'Make a productivity tool',
        'Build an e-commerce store',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, call actual AI API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
        suggestions: generateSuggestions(input),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const generateAIResponse = (userInput: string): string => {
    const inputLower = userInput.toLowerCase();

    if (inputLower.includes('restaurant') || inputLower.includes('food')) {
      return `Great! I'll help you build a restaurant app. Here's what I'm thinking:

**Features:**
- Menu browsing with photos
- Online ordering & delivery
- Table reservations
- Customer reviews
- Push notifications for orders

**Screens:**
1. Home - Featured items & promotions
2. Menu - Browse dishes by category
3. Cart - Review & checkout
4. Orders - Track delivery status
5. Profile - Account & settings

Would you like me to:
A) Generate the full app with these features
B) Customize the features first
C) Start with a simple MVP`;
    }

    if (inputLower.includes('fitness') || inputLower.includes('workout')) {
      return `Perfect! A fitness app. Let me create something awesome for you.

**Core Features:**
- Workout tracking & logging
- Exercise library with videos
- Progress charts & analytics
- Meal planning
- Social challenges

**Tech Stack:**
- React Native for iOS & Android
- Supabase for data & auth
- Chart library for analytics
- Camera access for progress photos

Ready to build this? I can have a working prototype in about 30 seconds.`;
    }

    return `I understand you want to build "${userInput}". Let me analyze this and create a plan...

**What I'll build:**
- Modern, responsive design
- User authentication
- Database integration
- API endpoints
- Mobile-ready

**Time estimate:** 20-30 seconds

Should I proceed with generation?`;
  };

  const generateSuggestions = (userInput: string): string[] => {
    const inputLower = userInput.toLowerCase();

    if (inputLower.includes('restaurant')) {
      return [
        'Add payment integration',
        'Include loyalty program',
        'Add table booking',
        'Enable multi-language support',
      ];
    }

    return [
      'Add more features',
      'Customize the design',
      'Generate the app now',
      'Show me a preview',
    ];
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg border">
      {/* Header */}
      <div className="border-b p-4 bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-900/20 dark:to-cyan-900/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat to build your app
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>

              {/* Code Snippet */}
              {message.codeSnippet && (
                <div className="mt-3 p-3 bg-black rounded-lg overflow-x-auto">
                  <code className="text-xs text-green-400">{message.codeSnippet}</code>
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs opacity-75">Suggestions:</p>
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-3 py-2 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-2 text-xs opacity-60">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="border-t p-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2 mb-3 overflow-x-auto">
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Code className="h-3 w-3 mr-1" />
            Add Page
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Smartphone className="h-3 w-3 mr-1" />
            Mobile View
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Database className="h-3 w-3 mr-1" />
            Add Data
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Palette className="h-3 w-3 mr-1" />
            Change Theme
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Describe what you want to build or change..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Shift + Enter for new line • Just chat naturally about what you want
        </p>
      </div>
    </div>
  );
}


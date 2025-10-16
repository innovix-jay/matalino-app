import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Code2, 
  Sparkles, 
  Layers, 
  Database, 
  Boxes, 
  Puzzle,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Workflow,
  Globe,
  Smartphone,
  Palette
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-violet-600" />
              <Zap className="h-4 w-4 text-cyan-500 absolute -bottom-1 -right-1" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">JcalAI</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">by Innovix Dynamix</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                Start Building Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Rocket className="h-4 w-4 mr-2" />
            The Future of No-Code Development
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build Apps with
            <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent"> AI</span>
            <br />
            Not Code
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform ideas into production-ready apps in minutes. JcalAI uses advanced AI to scaffold, design, 
            and deploy complete web and mobile applications—no coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your First App
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
                <Globe className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Production-ready code</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Export & own your code</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Deploy anywhere</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Platform Capabilities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Build Anything
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive no-code platform that rivals Replit, Cursor, Lovable, and Bolt—with the power of AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-violet-200 dark:hover:border-violet-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Visual Drag & Drop Builder</CardTitle>
              <CardDescription>
                Design beautiful interfaces with an intuitive visual editor. Drag, drop, and customize components in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-violet-500" />
                  Live preview & editing
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-violet-500" />
                  Responsive design tools
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-violet-500" />
                  Component library
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-cyan-200 dark:hover:border-cyan-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle>AI-Powered Scaffolding</CardTitle>
              <CardDescription>
                Describe your app and watch AI create a complete project structure with UI, logic, and database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  Smart project setup
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  Auto-generated code
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  Best practices built-in
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Visual Database Designer</CardTitle>
              <CardDescription>
                Design your data models visually. Create tables, relationships, and APIs without writing SQL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Visual schema builder
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Relationship mapping
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Auto-generated APIs
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <CardTitle>API & Integration Hub</CardTitle>
              <CardDescription>
                Connect to any service with visual API builders. Stripe, SendGrid, Twilio—all plug-and-play.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Pre-built integrations
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Custom API builder
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Webhook automation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-200 dark:hover:border-pink-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Smart Templates</CardTitle>
              <CardDescription>
                Start from proven templates for dashboards, e-commerce, SaaS, and more. Customize to your needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-pink-500" />
                  100+ templates
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-pink-500" />
                  Industry-specific
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-pink-500" />
                  Fully customizable
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <CardTitle>One-Click Deployment</CardTitle>
              <CardDescription>
                Deploy to Vercel, Netlify, or your own infrastructure with a single click. Full CI/CD included.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Multiple platforms
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Custom domains
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Auto-scaling
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Platform Types Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              What You Can Build
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Any App, Any Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From MVPs to production apps—web, mobile, automation, and more
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20">
              <Globe className="h-12 w-12 text-violet-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Web Apps</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Dashboards, portals, SaaS platforms</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
              <Smartphone className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Mobile Apps</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">iOS, Android, progressive web apps</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Workflow className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Automations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Workflows, integrations, agents</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Boxes className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">AI Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Chatbots, content generators, AI apps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Edge Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Why JcalAI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Beyond the Competition
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We combine the best of Replit, Cursor, Lovable, and Bolt—then go further
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-900/10 dark:to-cyan-900/10">
            <CheckCircle2 className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Faster than Replit</h3>
              <p className="text-gray-600 dark:text-gray-300">AI-powered scaffolding creates complete projects in seconds, not minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10">
            <CheckCircle2 className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">More Powerful than Lovable</h3>
              <p className="text-gray-600 dark:text-gray-300">Full database design, API integrations, and advanced logic—not just UI</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
            <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Smarter than Bolt</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced AI routing, cost optimization, and intelligent architecture selection</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">More Flexible than Cursor</h3>
              <p className="text-gray-600 dark:text-gray-300">Export your code, deploy anywhere, extend infinitely—you own everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join the next generation of builders creating apps with AI, not code
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-violet-600 hover:bg-gray-100">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-75">No credit card required • Build unlimited MVPs • Export your code</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-violet-400" />
                <Zap className="h-4 w-4 text-cyan-400 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">JcalAI</span>
                <p className="text-xs text-gray-400">by Innovix Dynamix</p>
              </div>
            </div>
            <p className="text-center text-gray-400 max-w-md">
              Empowering the next generation of builders with AI-powered no-code technology
            </p>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} JcalAI by Innovix Dynamix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

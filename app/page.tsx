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
  Palette,
  Users,
  Mail,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { MatalinoLogo } from '@/components/ui/matalino-logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MatalinoLogo size="md" />
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                Launch Your Business
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
            The Creator Economy Platform
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build Your Creator
            <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent"> Empire</span>
            <br />
            With AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Launch digital products, grow your email list, and scale your creator business with Matalino. 
            The all-in-one platform that turns your expertise into income—powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating Today
              </Button>
            </Link>
            <Link href="https://matalino.online" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
                <Globe className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Launch in minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Grow your audience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Scale your income</span>
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
            Everything You Need to Build Your Creator Business
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Launch digital products, grow your audience, and scale your income—all in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-violet-200 dark:hover:border-violet-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Digital Product Builder</CardTitle>
              <CardDescription>
                Create and sell digital products, courses, and services with beautiful, conversion-optimized pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-violet-500" />
                  Landing page builder
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-violet-500" />
                  Product showcase tools
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-violet-500" />
                  Checkout integration
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-cyan-200 dark:hover:border-cyan-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate compelling copy, product descriptions, and marketing content with advanced AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  Marketing copy generation
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  Product descriptions
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-cyan-500" />
                  Email campaigns
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Email Marketing Hub</CardTitle>
              <CardDescription>
                Build and grow your email list with powerful automation, segmentation, and campaign tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Subscriber management
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Automated sequences
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  Analytics & insights
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>
                Accept payments securely with Stripe integration. Handle subscriptions, one-time payments, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Stripe integration
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Subscription management
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Revenue tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-200 dark:hover:border-pink-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Creator Templates</CardTitle>
              <CardDescription>
                Launch faster with proven templates for courses, coaching, digital products, and membership sites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-pink-500" />
                  Course templates
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-pink-500" />
                  Coaching packages
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-pink-500" />
                  Membership sites
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-800">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Track your growth with detailed analytics on sales, subscribers, and engagement metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Revenue tracking
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Subscriber analytics
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  Growth insights
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
              Build Your Creator Empire
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From digital products to email marketing—everything you need to grow your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20">
              <Boxes className="h-12 w-12 text-violet-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Digital Products</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Courses, ebooks, templates, tools</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
              <Mail className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Email Marketing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Newsletters, sequences, automation</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Payment Processing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Stripe integration, subscriptions</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Growth tracking, insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Edge Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Why Matalino
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Built for Creators, By Creators
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The only platform that combines product creation, audience growth, and revenue optimization
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-900/10 dark:to-cyan-900/10">
            <CheckCircle2 className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Launch in Minutes, Not Months</h3>
              <p className="text-gray-600 dark:text-gray-300">Go from idea to paying customers in days, not months. Our AI handles the technical complexity.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10">
            <CheckCircle2 className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">All-in-One Creator Platform</h3>
              <p className="text-gray-600 dark:text-gray-300">No need for multiple tools. Product creation, email marketing, and payments—all integrated.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
            <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">AI-Powered Growth</h3>
              <p className="text-gray-600 dark:text-gray-300">Our AI helps optimize your content, pricing, and marketing for maximum revenue growth.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Your Business, Your Way</h3>
              <p className="text-gray-600 dark:text-gray-300">Full ownership of your products, audience, and revenue. No platform lock-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Creator Empire?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of creators building profitable businesses with Matalino
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-violet-600 hover:bg-gray-100">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating Free
              </Button>
            </Link>
            <Link href="https://innovixdynamix.com/matalino" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-75">No credit card required • Launch unlimited products • Keep 100% of your revenue</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            <MatalinoLogo size="lg" className="text-gray-400" />
            <p className="text-center text-gray-400 max-w-md">
              Empowering creators to build, launch, and scale profitable digital businesses
            </p>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Matalino by Innovix Dynamix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

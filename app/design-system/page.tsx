import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient">
            Design System Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the modern design system with glass-morphism,
            aurora backgrounds, and smooth animations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand-1 to-brand-2 hover:opacity-90"
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        {/* Glass Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Glass-Morphism Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-card rounded-lg p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">Feature One</h3>
              <p className="text-muted-foreground mb-4">
                Beautiful glass-morphism effect with subtle borders and backdrop blur
                for a modern, elegant look.
              </p>
              <Button variant="ghost" size="sm">
                Learn More →
              </Button>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold mb-3">Feature Two</h3>
              <p className="text-muted-foreground mb-4">
                Hover effects with smooth scale transitions that create engaging
                interactions with your users.
              </p>
              <Button variant="ghost" size="sm">
                Learn More →
              </Button>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-lg p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-3">Feature Three</h3>
              <p className="text-muted-foreground mb-4">
                Gradient borders using CSS masks for a premium,
                polished appearance across all components.
              </p>
              <Button variant="ghost" size="sm">
                Learn More →
              </Button>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16 glass-card rounded-lg p-8">
          <h2 className="text-3xl font-display font-bold mb-8">
            Typography System
          </h2>
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-display font-bold mb-2">
                Heading 1 - Space Grotesk
              </h1>
              <p className="text-muted-foreground">
                Used for main headings with font-display class
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-display font-bold mb-2">
                Heading 2 - Space Grotesk
              </h2>
              <p className="text-muted-foreground">
                Used for section headings
              </p>
            </div>
            <div>
              <p className="text-lg font-sans mb-2">
                Body text - Inter Regular
              </p>
              <p className="text-muted-foreground">
                Default font for body copy and paragraphs
              </p>
            </div>
            <div>
              <p className="text-2xl text-gradient font-display font-bold">
                Gradient Text Effect
              </p>
              <p className="text-muted-foreground">
                Brand gradient applied to text using .text-gradient utility
              </p>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Brand Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-brand-1 animate-pulse-slow" />
              <h3 className="font-semibold mb-2">Brand Purple</h3>
              <p className="text-sm text-muted-foreground font-mono">
                hsl(258 90% 66%)
              </p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-brand-2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <h3 className="font-semibold mb-2">Brand Blue</h3>
              <p className="text-sm text-muted-foreground font-mono">
                hsl(199 89% 48%)
              </p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-brand-3 animate-pulse-slow" style={{ animationDelay: '2s' }} />
              <h3 className="font-semibold mb-2">Brand Orange</h3>
              <p className="text-sm text-muted-foreground font-mono">
                hsl(25 95% 53%)
              </p>
            </div>
          </div>
        </section>

        {/* Animations Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Animation Utilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-brand-1 to-brand-2 mx-auto mb-4 animate-fade-in" />
              <h4 className="font-semibold mb-2">Fade In</h4>
              <p className="text-sm text-muted-foreground">animate-fade-in</p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-brand-2 to-brand-3 mx-auto mb-4 animate-float" />
              <h4 className="font-semibold mb-2">Float</h4>
              <p className="text-sm text-muted-foreground">animate-float</p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-brand-3 to-brand-1 mx-auto mb-4 animate-pulse-slow" />
              <h4 className="font-semibold mb-2">Pulse Slow</h4>
              <p className="text-sm text-muted-foreground">animate-pulse-slow</p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-brand-1 to-brand-3 mx-auto mb-4 animate-slide-down" />
              <h4 className="font-semibold mb-2">Slide Down</h4>
              <p className="text-sm text-muted-foreground">animate-slide-down</p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="glass-card rounded-lg p-8">
          <h2 className="text-3xl font-display font-bold mb-8">
            Button Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-to-r from-brand-1 to-brand-2">
              Gradient Button
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

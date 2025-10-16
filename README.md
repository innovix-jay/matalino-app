# Matalino - Creator Platform

A modern creator platform built with Next.js 14, Supabase, and Stripe for selling digital products, managing subscribers, and growing your creator business.

## 🚀 Features

- **Authentication** - Google OAuth and email/password via Supabase
- **Products** - Create and sell digital products, courses, and services
- **Payments** - Stripe Checkout integration for secure payments
- **Email Subscribers** - Build and manage your email list
- **Multi-tenant** - Secure data isolation with Row Level Security
- **Dashboard** - Beautiful admin interface for creators
- **Responsive** - Mobile-first design with Tailwind CSS

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Payments**: [Stripe](https://stripe.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Stripe account (test mode is fine)
- Git installed

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/innovix-jay/matalino-app.git
   cd matalino-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your keys:
   - Supabase URL and Anon Key
   - Stripe Publishable and Secret keys
   - App URL (http://localhost:3000 for local)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

1. Create a Supabase project at https://supabase.com/dashboard

2. Run the migrations in the Supabase SQL Editor:
   - First run: `supabase/migrations/001_initial_schema.sql`
   - Then run: `supabase/migrations/002_rls_policies.sql`

3. Enable Google OAuth in Supabase:
   - Go to Authentication → Providers
   - Enable Google
   - Add your Google OAuth credentials

4. Update redirect URLs in Supabase:
   - Go to Authentication → URL Configuration
   - Add: `http://localhost:3000/auth/callback`

## 💳 Stripe Setup

1. Create a Stripe account at https://stripe.com

2. Get your test API keys:
   - Dashboard → Developers → API Keys
   - Copy Publishable key (pk_test_...)
   - Copy Secret key (sk_test_...)

3. Add keys to `.env.local`

4. Test with test card: `4242 4242 4242 4242`

## 🌐 Production Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import `innovix-jay/matalino-app`
   - Add environment variables (see `VERCEL_ENV_VARS.md`)
   - Deploy

3. **Post-deployment**
   - Update Supabase redirect URLs with Vercel URL
   - Configure Stripe webhook
   - Test the production app

### Complete Deployment Guide

See these files for detailed instructions:
- `DEPLOYMENT.md` - Step-by-step deployment guide
- `VERCEL_ENV_VARS.md` - All environment variables explained
- `PRODUCTION_CHECKLIST.md` - Pre-launch checklist
- `STRIPE_SETUP.md` - Stripe configuration guide

## 📁 Project Structure

```
matalino/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   │   ├── checkout/         # Stripe checkout
│   │   └── webhooks/         # Stripe webhooks
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Creator dashboard
│   │   ├── products/         # Product management
│   │   └── subscribers/      # Subscriber management
│   └── store/                # Public storefront
├── components/               # React components
│   ├── ui/                   # UI primitives
│   └── ...                   # Feature components
├── lib/                      # Shared utilities
│   ├── actions/              # Server actions
│   ├── hooks/                # React hooks
│   ├── supabase/             # Supabase clients
│   ├── error-handler.ts      # Error handling
│   ├── rate-limit.ts         # Rate limiting
│   └── logger.ts             # Logging utility
├── supabase/
│   └── migrations/           # Database migrations
└── types/                    # TypeScript types
```

## 🔒 Security

- **Authentication**: Supabase Auth with secure session management
- **Authorization**: Row Level Security (RLS) policies
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **HTTPS**: Enforced in production via Vercel
- **Security Headers**: Configured in `next.config.js`
- **Input Validation**: Server-side validation on all inputs

## 🧪 Testing

### Run Type Checking
```bash
npm run type-check
```

### Run Linting
```bash
npm run lint
```

### Run All Checks
```bash
npm run check
```

### Production Build Test
```bash
npm run build
npm start
```

## 📊 Monitoring

### Health Check Endpoint
```bash
curl https://your-app.vercel.app/api/health/check
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

## 🛠️ Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting (recommended)

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature

# Create pull request on GitHub
```

## 📝 Environment Variables

### Required (Local & Production)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_APP_URL` - Your app URL

### Optional (Production)
- `STRIPE_WEBHOOK_SECRET` - For order webhooks
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations
- AI API keys (if using AI features)
- Monitoring service keys (Sentry, etc.)

See `env.example` and `VERCEL_ENV_VARS.md` for complete list.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Troubleshooting
See `PRODUCTION_CHECKLIST.md` for common issues and solutions.

### Contact
- Email: support@matalino.app (update with your actual email)
- GitHub Issues: [Create an issue](https://github.com/innovix-jay/matalino-app/issues)

## 🗺️ Roadmap

- [ ] AI-powered content generation
- [ ] Email campaign builder
- [ ] Link-in-bio feature
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Multi-language support

## ⭐ Acknowledgments

Built with:
- Next.js by Vercel
- Supabase for backend
- Stripe for payments
- Tailwind CSS for styling
- Radix UI for components

---

Made with ❤️ for creators


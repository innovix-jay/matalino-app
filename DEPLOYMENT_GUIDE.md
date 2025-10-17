# JcalAI Deployment Guide

Complete guide for deploying JcalAI to production.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment to Vercel](#deployment-to-vercel)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase account (free tier works)
- ✅ Domain name (optional)
- ✅ Stripe account (for payments, optional)

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd jcalai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables))

---

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and name
4. Set database password (save this!)
5. Select region closest to your users
6. Wait for project creation (~2 minutes)

### 2. Get Supabase Credentials

From your Supabase project dashboard:
1. Go to Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### 3. Run Database Migrations

#### Option A: Supabase Studio (Recommended)
1. Go to SQL Editor in Supabase Dashboard
2. Create new query
3. Copy content from `supabase/migrations/001_initial_schema.sql`
4. Run query
5. Repeat for `002_rls_policies.sql`
6. Repeat for `003_jcalai_platform_schema.sql`

#### Option B: Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Link project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

### 4. Verify Database Setup

Run this SQL to check tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: projects, pages, components, templates, deployments, etc.

---

## Deployment to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add Environment Variables (see below)
7. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Environment Variables

### Required Variables

Add these in Vercel → Settings → Environment Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # ⚠️ SECRET!

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Optional: Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_... # ⚠️ SECRET!
STRIPE_WEBHOOK_SECRET=whsec_... # ⚠️ SECRET!

# Optional: Email
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Optional: Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=... # ⚠️ SECRET!
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Environment Scopes

- **Production**: Live site variables
- **Preview**: For preview deployments
- **Development**: Local development

Tip: Use different Supabase projects for production/development

---

## Post-Deployment

### 1. Verify Deployment

1. Visit your Vercel deployment URL
2. Check homepage loads
3. Try signup/login
4. Create a test project with AI

### 2. Configure Custom Domain (Optional)

#### In Vercel:
1. Go to Settings → Domains
2. Add your domain (e.g., `jcalai.com`)
3. Add DNS records as shown

#### DNS Configuration:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

Wait 24-48 hours for DNS propagation

### 3. Set Up SSL

Vercel automatically provisions SSL certificates via Let's Encrypt. No action needed!

### 4. Configure Authentication

#### Email Setup:
1. In Supabase Dashboard → Authentication → Settings
2. Configure SMTP or use Supabase's email service
3. Customize email templates

#### Social Login (Optional):
1. Enable providers in Supabase Auth settings
2. Add OAuth credentials
3. Configure callback URLs

### 5. Seed Default Templates (Optional)

```bash
# Create a one-time script or use Supabase SQL Editor:
# Run the seedDefaultTemplates function from lib/actions/templates.ts
```

---

## Monitoring

### 1. Error Tracking (Sentry)

If using Sentry:
1. Create project at [sentry.io](https://sentry.io)
2. Add DSN to environment variables
3. Errors will automatically be captured

### 2. Analytics (PostHog)

If using PostHog:
1. Create account at [posthog.com](https://posthog.com)
2. Add project key to environment variables
3. Events will be tracked automatically

### 3. Vercel Analytics

Built-in analytics available at: Vercel Dashboard → Analytics

Includes:
- Page views
- Performance metrics
- Edge function usage

### 4. Database Monitoring

Supabase provides:
- Query performance
- Database size
- Connection stats
- Row-level logs

Access at: Supabase Dashboard → Database → Performance

---

## Scaling

### When to Scale

Consider upgrading when you reach:
- 100+ projects created
- 1,000+ page views/day
- 10GB database size
- 100+ concurrent users

### Supabase Scaling

**Free → Pro ($25/mo)**
- 8GB database
- 100GB bandwidth
- 50GB file storage
- Better performance

**Pro → Team/Enterprise**
- Dedicated resources
- Read replicas
- Point-in-time recovery

### Vercel Scaling

**Hobby → Pro ($20/mo/user)**
- Unlimited bandwidth
- Advanced analytics
- Team collaboration

### Performance Optimization

1. **Enable Edge Caching**
```typescript
// In Next.js pages
export const revalidate = 3600; // Cache for 1 hour
```

2. **Optimize Images**
```tsx
import Image from 'next/image';
<Image src="..." width={500} height={500} />
```

3. **Use React Server Components**
```tsx
// app/page.tsx - Server Component by default
async function getData() {
  // Runs on server
}
```

---

## Backup & Recovery

### Database Backups

**Automatic (Supabase Pro+)**
- Daily automatic backups
- 7-day retention
- Point-in-time recovery

**Manual Backup**
```bash
# Using pg_dump
pg_dump -h db.xxxxx.supabase.co -U postgres database_name > backup.sql

# Restore
psql -h db.xxxxx.supabase.co -U postgres database_name < backup.sql
```

### Code Backups

- GitHub repository (primary)
- Vercel deployment history
- Download code via Vercel CLI

---

## Troubleshooting

### Deployment Fails

**Check build logs:**
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. Review "Building" logs

**Common issues:**
- Missing environment variables
- Type errors (run `npm run type-check`)
- Module not found (check package.json)

### Database Connection Errors

1. Verify Supabase credentials
2. Check Supabase project is not paused
3. Ensure RLS policies allow access
4. Check service role key for admin operations

### Authentication Issues

1. Verify Supabase URL in environment
2. Check auth callback URLs
3. Ensure email templates are configured
4. Review Supabase auth logs

### Slow Performance

1. Check Vercel analytics for bottlenecks
2. Review Supabase query performance
3. Enable caching where appropriate
4. Optimize large database queries
5. Consider upgrading to Pro tier

### 500 Internal Server Error

1. Check Vercel function logs
2. Review Sentry error reports
3. Verify all environment variables
4. Check for database constraint violations

---

## Security Checklist

- [ ] All secrets are in environment variables (not in code)
- [ ] Service role key is marked as secret
- [ ] RLS policies are enabled on all tables
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation on all forms
- [ ] SQL injection protection (use Supabase .eq(), not raw SQL)
- [ ] XSS protection (React escapes by default)
- [ ] Environment variables are scoped correctly

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs in Sentry
- Check database size in Supabase
- Monitor deployment success rate

**Monthly:**
- Review and update dependencies
- Check for security updates
- Analyze user analytics
- Review and optimize slow queries

**Quarterly:**
- Security audit
- Performance optimization review
- Backup verification
- Capacity planning

---

## Rollback Procedure

If a deployment causes issues:

1. **Instant Rollback (Vercel)**
   - Go to Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Database Rollback**
   - Restore from backup
   - Revert migrations if needed

3. **Code Rollback**
   - Git revert
   - Force deploy previous commit

---

## Support

- **Documentation**: See README.md and ARCHITECTURE.md
- **Issues**: GitHub Issues
- **Email**: support@jcalai.com (if available)

---

**Last Updated**: October 2024
**Version**: 1.0.0



# Vercel Environment Variables Configuration

When deploying to Vercel, add these environment variables in your project settings:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## ✅ REQUIRED - Core Functionality

### Supabase (Database & Auth)
```
NEXT_PUBLIC_SUPABASE_URL=https://szuglktlqfpjhizvgtah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your `matalino-prod` project
3. Go to **Settings** → **API**
4. Copy `Project URL` and `anon/public` key

### Stripe (Payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Start with TEST mode keys, switch to LIVE when ready**

**Where to find these:**
1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle top-right)
3. Go to **Developers** → **API Keys**
4. Copy Publishable and Secret keys

**For Webhook Secret:**
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-vercel-app.vercel.app/api/webhooks/stripe`
4. Events: `checkout.session.completed`, `payment_intent.succeeded`
5. Copy the **Signing secret**

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

**Update `NEXT_PUBLIC_APP_URL` after first deployment with your actual Vercel URL**

---

## ⚠️ OPTIONAL - Enhanced Features

### AI Features (Only add if using AI)
```
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_AI_API_KEY=xxxxx
```

### Email Service - Resend (For transactional emails)
```
RESEND_API_KEY=re_xxxxx
```
Get from: https://resend.com/api-keys

### Redis Caching - Upstash (For better performance)
```
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```
Get from: https://upstash.com

### Analytics - PostHog (For user analytics)
```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```
Get from: https://posthog.com

### Error Monitoring - Sentry (For production errors)
```
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```
Get from: https://sentry.io

---

## 🔐 Security Best Practices

### Generate NextAuth Secret
```bash
# Run this command to generate a secure random string:
openssl rand -base64 32
```

Then add to Vercel:
```
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## 📝 Step-by-Step Deployment Checklist

### 1. Prepare Environment Variables
- [ ] Copy Supabase URL and keys from dashboard
- [ ] Get Stripe test keys (or live keys if ready)
- [ ] Generate NextAuth secret

### 2. Deploy to Vercel
- [ ] Go to https://vercel.com/new
- [ ] Import `innovix-jay/matalino-app` from GitHub
- [ ] Add REQUIRED environment variables
- [ ] Click **Deploy**

### 3. Post-Deployment Configuration
- [ ] Copy your Vercel URL (e.g., `https://matalino-app-xxx.vercel.app`)
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
- [ ] Update Supabase redirect URLs:
  - Go to Supabase → Authentication → URL Configuration
  - Add `https://your-vercel-url.vercel.app/auth/callback`
  - Set Site URL to `https://your-vercel-url.vercel.app`
- [ ] Add Stripe webhook endpoint:
  - URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
  - Copy webhook secret to Vercel env vars
- [ ] Redeploy in Vercel (to pick up new env vars)

### 4. Test Production App
- [ ] Visit your Vercel URL
- [ ] Test Google OAuth login
- [ ] Create a test product
- [ ] Test Stripe checkout (use test card: 4242 4242 4242 4242)
- [ ] Verify webhook received in Stripe dashboard

---

## 🚀 Going Live (Real Payments)

When ready for production:

1. **Switch Stripe to Live Mode:**
   - Get live API keys from Stripe dashboard (switch to Live mode)
   - Update Vercel env vars with `pk_live_` and `sk_live_` keys
   - Create new webhook with live mode endpoint

2. **Complete Stripe Account:**
   - Verify business details
   - Set up payout account
   - Configure tax settings

3. **Update Marketing:**
   - Announce launch
   - Test full purchase flow with real card
   - Monitor first real transactions

---

## 🔍 Troubleshooting

**Build fails on Vercel:**
- Check build logs for errors
- Run `npm run build` locally first
- Verify all REQUIRED env vars are set

**Authentication not working:**
- Verify Supabase redirect URLs match your Vercel domain
- Check `NEXT_PUBLIC_APP_URL` is correct
- Clear browser cache and try again

**Stripe checkout fails:**
- Verify Stripe keys are for correct mode (test/live)
- Check browser console for errors
- Ensure product has valid price > 0

**Webhooks not receiving events:**
- Verify webhook URL is correct
- Check Stripe webhook logs for errors
- Ensure `STRIPE_WEBHOOK_SECRET` is set

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs


# Matalino - Deployment Guide

## Prerequisites

- [x] GitHub repository created: `https://github.com/innovix-jay/matalino-app`
- [x] Supabase project created (`matalino-prod`)
- [x] Database migrations applied
- [ ] Stripe account set up
- [ ] Vercel account created

---

## 1. Stripe Setup

### Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a new account or sign in
3. Switch to **Test Mode** (toggle in top-right)
4. Go to **Developers** → **API Keys**
5. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Add Stripe Keys to .env.local

Add these to your `.env.local` file:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### Test Locally

1. Restart your dev server: `npm run dev`
2. Create a product in the dashboard
3. Visit the storefront page `/store/[product-id]`
4. Click "Buy Now" - it should redirect to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`, any future date, any CVC

---

## 2. Vercel Deployment

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. **Import Git Repository**:
   - Select `innovix-jay/matalino-app`
   - Click **Import**
4. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Add Environment Variables in Vercel

In the project settings, add these environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://szuglktlqfpjhizvgtah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# App URL (update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

5. Click **Deploy**

### Update Supabase Auth URLs

After your first deploy, you'll get a Vercel URL like `https://matalino-app-xxx.vercel.app`.

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `matalino-prod` project
3. Go to **Authentication** → **URL Configuration**
4. Add to **Redirect URLs**:
   ```
   https://matalino-app-xxx.vercel.app/auth/callback
   https://matalino-app-xxx.vercel.app
   ```
5. Update **Site URL**: `https://matalino-app-xxx.vercel.app`

### Update NEXT_PUBLIC_APP_URL

1. Go back to Vercel project settings
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
3. Redeploy (Vercel → Deployments → Click ⋯ → Redeploy)

---

## 3. Testing Production

1. Visit your Vercel URL
2. Click **"Get Started"** → **"Sign In"**
3. Test Google OAuth login
4. Create a product in the dashboard
5. Test checkout flow with Stripe test card

---

## 4. Next Steps (Optional)

### Add Stripe Webhook for Order Fulfillment

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Vercel env vars:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### Custom Domain

1. In Vercel project settings → **Domains**
2. Add your custom domain (e.g., `matalino.app`)
3. Update Supabase redirect URLs with your custom domain

---

## Environment Variables Checklist

**Local (.env.local):**
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- ⚠️  STRIPE_SECRET_KEY
- ⚠️  NEXT_PUBLIC_APP_URL (http://localhost:3000)

**Vercel (Production):**
- ⚠️  All of the above (with production URLs)
- ⚠️  STRIPE_WEBHOOK_SECRET (optional, for webhooks)

---

## Troubleshooting

### Build fails on Vercel
- Check build logs for TypeScript errors
- Make sure all environment variables are set
- Run `npm run build` locally to test

### Authentication not working
- Verify redirect URLs in Supabase match your domain
- Check that `NEXT_PUBLIC_APP_URL` is correct
- Ensure Google OAuth is enabled in Supabase

### Stripe checkout fails
- Verify Stripe keys are correct
- Check you're in Test Mode
- Look at browser console for errors

---

## Support

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs





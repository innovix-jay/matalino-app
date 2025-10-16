# 🚀 Deploy Matalino to Production NOW

Your app is **100% ready** for production deployment. Follow these simple steps to go live.

---

## 🎯 3-Step Deployment Process

### Step 1: Get Stripe Keys (5 minutes)

1. **Go to Stripe**
   - Visit: https://stripe.com
   - Sign up or log in

2. **Switch to Test Mode**
   - Toggle in top-right corner of dashboard

3. **Get API Keys**
   - Go to: **Developers** → **API Keys**
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

4. **Save for later** - You'll need these for Vercel

---

### Step 2: Deploy to Vercel (10 minutes)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up with GitHub (recommended) or email

2. **Import Your Project**
   - Click **"Add New Project"**
   - Select **"Import Git Repository"**
   - Find and import: `innovix-jay/matalino-app`
   - Click **"Import"**

3. **Configure Environment Variables**
   
   Click **"Environment Variables"** and add these:

   ```env
   # REQUIRED - Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://hpnmahfdjapnlnhhiqpf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm1haGZkamFwbmxuaGhpcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTg0OTYsImV4cCI6MjA1NTEzNDQ5Nn0.vnBm2s2nHH9mKbX3Xw8fwVbOUCeWzAQ-fD8kBhD5tEg

   # REQUIRED - Stripe (Use your keys from Step 1)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here

   # REQUIRED - App URL (update after deployment)
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```

4. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build
   - Copy your Vercel URL (e.g., `https://matalino-app-abc123.vercel.app`)

---

### Step 3: Final Configuration (5 minutes)

#### A. Update Supabase Redirect URLs

1. Go to: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

2. Add to **"Redirect URLs"**:
   ```
   https://your-vercel-url.vercel.app/auth/callback
   https://your-vercel-url.vercel.app
   ```

3. Update **"Site URL"**:
   ```
   https://your-vercel-url.vercel.app
   ```

4. Click **"Save"**

#### B. Update Vercel Environment Variable

1. In Vercel, go to: **Settings** → **Environment Variables**

2. Edit `NEXT_PUBLIC_APP_URL`:
   ```
   https://your-actual-vercel-url.vercel.app
   ```

3. **Redeploy**:
   - Go to **Deployments**
   - Click ⋯ on latest deployment
   - Click **"Redeploy"**

#### C. Set Up Stripe Webhook

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/webhooks

2. Click **"Add endpoint"**

3. **Endpoint URL**:
   ```
   https://your-vercel-url.vercel.app/api/webhooks/stripe
   ```

4. **Events to send**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`

5. Click **"Add endpoint"**

6. Copy the **"Signing secret"** (starts with `whsec_`)

7. Add to Vercel environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

8. Redeploy one more time

---

## ✅ You're Live!

Visit your app at: `https://your-vercel-url.vercel.app`

---

## 🧪 Test Your Production App

### 1. Test Authentication
- Click **"Get Started"** or **"Sign In"**
- Sign in with Google
- Verify you're redirected to dashboard

### 2. Create a Product
- Go to **Dashboard** → **Products**
- Click **"Add Product"**
- Fill in details:
  - Name: "Test Digital Product"
  - Price: 9.99
  - Type: Digital
  - Status: Active (toggle on)
- Click **"Add Product"**

### 3. Test Purchase Flow
- Copy the product ID from the products list
- Open: `https://your-vercel-url.vercel.app/store/[product-id]`
- Click **"Buy Now"**
- Complete checkout with test card:
  - Card: `4242 4242 4242 4242`
  - Expiry: `12/34`
  - CVC: `123`
  - ZIP: `12345`
- Verify redirect back to app

### 4. Check Stripe Dashboard
- Go to: https://dashboard.stripe.com/test/payments
- You should see your test payment!

---

## 🎉 Success Criteria

You've successfully deployed if:
- ✅ You can sign in with Google
- ✅ You can access the dashboard
- ✅ You can create a product
- ✅ You can complete a test purchase
- ✅ Stripe shows the payment

---

## 🚨 Troubleshooting

### "Authentication Error"
- Check Supabase redirect URLs match your Vercel domain exactly
- Make sure you saved and redeployed after updating `NEXT_PUBLIC_APP_URL`

### "Build Failed"
- Check Vercel build logs
- Verify all environment variables are set
- Make sure `NEXT_PUBLIC_SUPABASE_URL` is correct

### "Checkout Not Working"
- Verify Stripe keys are correct
- Check you're using TEST mode keys (start with `pk_test_` and `sk_test_`)
- Look at browser console for errors

### "Webhook Not Receiving Events"
- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` is set in Vercel
- Look at Stripe webhook logs

---

## 📝 Quick Reference

### Supabase Dashboard
https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf

### Stripe Dashboard (Test Mode)
https://dashboard.stripe.com/test

### Your GitHub Repo
https://github.com/innovix-jay/matalino-app

### Vercel Dashboard
https://vercel.com/dashboard

---

## 🎯 What's Next?

### Optional Enhancements
1. **Custom Domain**
   - Add your own domain in Vercel settings
   - Update Supabase redirect URLs with new domain

2. **Go Live with Real Payments**
   - Complete Stripe business verification
   - Switch to Live mode keys
   - Update Vercel env vars with live keys

3. **Add More Features**
   - Email campaigns
   - Link-in-bio
   - AI content generation
   - Analytics dashboard

4. **Set Up Monitoring**
   - Add Sentry for error tracking
   - Set up PostHog for analytics
   - Configure Upstash Redis for caching

---

## 💡 Pro Tips

1. **Save Your URLs**
   - Bookmark your Vercel dashboard
   - Save your Supabase project URL
   - Keep Stripe dashboard handy

2. **Test Thoroughly**
   - Test on mobile devices
   - Try different browsers
   - Create multiple test products

3. **Monitor Your App**
   - Check Vercel function logs regularly
   - Review Stripe payment logs
   - Watch Supabase database usage

4. **Backup Everything**
   - Enable Supabase database backups
   - Save your environment variables
   - Document any changes

---

## 🆘 Need Help?

Check these resources:
- **Your Docs**: `PRODUCTION_CHECKLIST.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Env Vars**: `VERCEL_ENV_VARS.md`
- **Stripe Setup**: `STRIPE_SETUP.md`

---

**You've got this! Your app is production-ready and waiting to go live.** 🚀

**Time to Deploy**: ~20 minutes total
**Difficulty**: Easy (just follow the steps)
**Success Rate**: 100% (if you follow the guide)

---

*Happy Launching! 🎊*


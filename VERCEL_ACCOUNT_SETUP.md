# Vercel Account Setup Guide for jay.cadmus@innovixdynamix.com

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Vercel Account

1. **Go to Vercel**
   - Open: https://vercel.com/signup
   
2. **Sign Up with Google** (Recommended)
   - Click **"Continue with Google"**
   - Use your email: `jay.cadmus@innovixdynamix.com`
   - Authorize Vercel to access your GitHub account
   
   **OR**
   
   **Sign Up with GitHub** (Alternative)
   - Click **"Continue with GitHub"**
   - This will automatically connect to your `innovix-jay` GitHub account
   - Authorize Vercel

3. **Complete Profile**
   - Name: Jason Cadmus
   - Team/Company: Innovix Dynamix (or personal)
   - Click **"Continue"**

---

## Step 2: Import Your Matalino Project

1. **From Vercel Dashboard**
   - Click **"Add New..."** → **"Project"**
   
2. **Import Git Repository**
   - You should see: `innovix-jay/matalino-app`
   - Click **"Import"**

3. **Configure Project**
   
   **Project Name**: `matalino-app` (or customize)
   
   **Framework Preset**: Next.js (auto-detected ✅)
   
   **Root Directory**: `./` (leave as default)
   
   **Build Command**: `npm run build` (auto-filled)
   
   **Output Directory**: `.next` (auto-filled)
   
4. **Add Environment Variables** ⚠️ IMPORTANT

   Click **"Environment Variables"** and add these:

   ```env
   # === REQUIRED - Supabase ===
   NEXT_PUBLIC_SUPABASE_URL=https://hpnmahfdjapnlnhhiqpf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm1haGZkamFwbmxuaGhpcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTg0OTYsImV4cCI6MjA1NTEzNDQ5Nn0.vnBm2s2nHH9mKbX3Xw8fwVbOUCeWzAQ-fD8kBhD5tEg

   # === REQUIRED - Stripe (Get from Step 3) ===
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

   # === REQUIRED - App URL (Update after first deploy) ===
   NEXT_PUBLIC_APP_URL=https://matalino-app.vercel.app
   ```

5. **Click "Deploy"**
   - Wait 2-3 minutes for the build
   - ☕ Grab a coffee while it deploys!

---

## Step 3: Get Stripe API Keys

**While Vercel is deploying**, set up Stripe:

1. **Go to Stripe**
   - Visit: https://stripe.com
   - Click **"Start now"**
   - Sign up with: `jay.cadmus@innovixdynamix.com`

2. **Activate Account**
   - You can skip most onboarding steps for now
   - Make sure you're in **Test Mode** (toggle top-right)

3. **Get API Keys**
   - Go to: **Developers** → **API Keys**
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)

4. **Save for Vercel**
   - You'll add these to Vercel after deployment completes

---

## Step 4: Post-Deployment Configuration

### A. Get Your Vercel URL

After deployment completes:
1. Vercel will show your live URL (e.g., `https://matalino-app-abc123.vercel.app`)
2. **Copy this URL** - you'll need it!

### B. Update Vercel Environment Variables

1. In Vercel, go to: **Settings** → **Environment Variables**

2. **Add/Update these variables:**

   ```env
   # Update App URL with your actual Vercel URL
   NEXT_PUBLIC_APP_URL=https://your-actual-vercel-url.vercel.app

   # Add Stripe keys (from Step 3)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

3. Click **"Save"**

### C. Update Supabase Auth URLs

1. Go to: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

2. **Add Redirect URLs:**
   ```
   https://your-vercel-url.vercel.app/auth/callback
   https://your-vercel-url.vercel.app
   ```

3. **Update Site URL:**
   ```
   https://your-vercel-url.vercel.app
   ```

4. Click **"Save"**

### D. Redeploy

1. Back in Vercel, go to **Deployments**
2. Click **⋯** on the latest deployment
3. Click **"Redeploy"**
4. Wait for new deployment to complete

### E. Set Up Stripe Webhook

1. Go to: https://dashboard.stripe.com/test/webhooks

2. Click **"Add endpoint"**

3. **Endpoint URL:**
   ```
   https://your-vercel-url.vercel.app/api/webhooks/stripe
   ```

4. **Select events:**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Click **"Add endpoint"**

6. Copy the **Signing secret** (starts with `whsec_`)

7. **Add to Vercel:**
   - Go to Vercel → Settings → Environment Variables
   - Add: `STRIPE_WEBHOOK_SECRET=whsec_your_secret`

8. **Redeploy one more time**

---

## Step 5: Test Your Live App! 🎉

### Visit Your App
Open: `https://your-vercel-url.vercel.app`

### Test Complete Flow

1. **Sign In**
   - Click **"Get Started"** or **"Sign In"**
   - Choose **"Continue with Google"**
   - Use: `jay.cadmus@innovixdynamix.com`
   - You should be redirected to the dashboard

2. **Create a Product**
   - Go to **Dashboard** → **Products**
   - Click **"Add Product"**
   - Fill in:
     - Name: "My First Digital Product"
     - Description: "Test product"
     - Price: 9.99
     - Type: Digital Download
     - Status: Active (toggle on)
   - Click **"Add Product"**

3. **Test Purchase**
   - Copy the product ID
   - Visit: `https://your-url.vercel.app/store/[product-id]`
   - Click **"Buy Now"**
   - Use test card:
     - Card: `4242 4242 4242 4242`
     - Expiry: `12/34`
     - CVC: `123`
     - ZIP: `12345`
   - Complete checkout

4. **Verify Payment**
   - Go to: https://dashboard.stripe.com/test/payments
   - You should see your test payment!

---

## ✅ Success Checklist

- [ ] Vercel account created with `jay.cadmus@innovixdynamix.com`
- [ ] GitHub connected to Vercel
- [ ] Project imported from `innovix-jay/matalino-app`
- [ ] All environment variables added
- [ ] First deployment successful
- [ ] Vercel URL copied and saved
- [ ] Supabase redirect URLs updated
- [ ] Stripe account created
- [ ] Stripe API keys added to Vercel
- [ ] Stripe webhook configured
- [ ] App redeployed with all configs
- [ ] Google sign-in tested and working
- [ ] Product creation tested
- [ ] Checkout flow tested with test card
- [ ] Payment visible in Stripe dashboard

---

## 🎯 Your Production URLs

Once complete, save these:

```
Production App: https://your-vercel-url.vercel.app
Vercel Dashboard: https://vercel.com/dashboard
Stripe Dashboard: https://dashboard.stripe.com/test
Supabase Dashboard: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf
GitHub Repo: https://github.com/innovix-jay/matalino-app
```

---

## 🆘 Common Issues

### "Build Failed"
- Check Vercel build logs
- Verify all REQUIRED environment variables are set
- Make sure `NEXT_PUBLIC_SUPABASE_URL` is correct

### "Authentication Redirect Error"
- Verify Supabase redirect URLs match your Vercel domain **exactly**
- No trailing slashes
- Include both `/auth/callback` and base URL

### "Checkout Not Working"
- Verify Stripe keys start with `pk_test_` and `sk_test_`
- Make sure you're in Test Mode in Stripe
- Check browser console for errors

### "Webhook Not Receiving"
- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` is set
- Look at Stripe webhook logs for delivery attempts

---

## 💡 Pro Tips

1. **Custom Domain** (Optional)
   - In Vercel Settings → Domains
   - Add your custom domain (e.g., `matalino.app`)
   - Update Supabase URLs accordingly

2. **Auto Deploy**
   - Vercel automatically deploys when you push to GitHub
   - Every commit to `main` branch triggers a deployment

3. **Preview Deployments**
   - Pull requests get preview URLs automatically
   - Test changes before merging to production

4. **Environment Variables**
   - Keep them secret!
   - Never commit them to GitHub
   - Update them in Vercel dashboard only

---

## 🚀 You're Live!

Your Matalino app is now in production and accessible worldwide!

**Next Steps:**
1. Test thoroughly with test data
2. When ready for real payments, switch Stripe to Live mode
3. Share your app URL with users
4. Monitor your Vercel analytics
5. Celebrate! 🎊

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Your Guides**: Check `DEPLOY_NOW.md` and `PRODUCTION_CHECKLIST.md`

---

**Estimated Total Time**: 20-30 minutes
**Difficulty**: Easy (just follow the steps)
**Cost**: $0 (Free tier)

**Good luck with your launch!** 🚀


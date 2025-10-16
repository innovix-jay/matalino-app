# 🚀 Vercel Project Setup - Step by Step

You're logged into Vercel! Follow these exact steps to deploy your Matalino app.

---

## Step 1: Import Your GitHub Repository

1. **Click "Add New..."** (top right) → **"Project"**

2. **Import Git Repository**
   - You should see your GitHub repos listed
   - Find: `innovix-jay/matalino-app`
   - Click **"Import"**

---

## Step 2: Configure Project Settings

### Project Name
```
matalino-app
```
(or customize to your preference like `matalino`, `matalino-production`, etc.)

### Framework Preset
- Should auto-detect as: **Next.js** ✅
- Leave as default

### Root Directory
```
./
```
(Leave as default - this is correct)

### Build Settings
- **Build Command**: `npm run build` (auto-filled ✅)
- **Output Directory**: `.next` (auto-filled ✅)
- **Install Command**: `npm install` (auto-filled ✅)

---

## Step 3: Add Environment Variables (CRITICAL!)

Click **"Environment Variables"** tab and add these **EXACTLY**:

### ✅ REQUIRED Variables

Copy and paste each of these:

#### 1. Supabase URL
```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:**
```
https://hpnmahfdjapnlnhhiqpf.supabase.co
```

#### 2. Supabase Anon Key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm1haGZkamFwbmxuaGhpcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTg0OTYsImV4cCI6MjA1NTEzNDQ5Nn0.vnBm2s2nHH9mKbX3Xw8fwVbOUCeWzAQ-fD8kBhD5tEg
```

#### 3. App URL (Temporary - we'll update after first deploy)
```
NEXT_PUBLIC_APP_URL
```
**Value:**
```
https://matalino-app.vercel.app
```

#### 4. Stripe Publishable Key (If you have it already)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
**Value:** (Get from https://dashboard.stripe.com/test/apikeys)
```
pk_test_YOUR_KEY_HERE
```
*Skip if you don't have Stripe set up yet - you can add later*

#### 5. Stripe Secret Key (If you have it already)
```
STRIPE_SECRET_KEY
```
**Value:** (Get from https://dashboard.stripe.com/test/apikeys)
```
sk_test_YOUR_KEY_HERE
```
*Skip if you don't have Stripe set up yet - you can add later*

### Environment Scope
- ✅ **Production** (checked)
- ✅ **Preview** (checked)
- ✅ **Development** (checked)

*Apply to all three environments*

---

## Step 4: Deploy! 🚀

1. **Click "Deploy"**

2. **Wait 2-3 minutes** for the build
   - You'll see the build logs
   - It should say "Building..." then "Deployed"

3. **Copy Your Vercel URL**
   - After deployment, you'll get a URL like:
   ```
   https://matalino-app-abc123.vercel.app
   ```
   - **SAVE THIS URL!** You'll need it for the next steps

---

## Step 5: Update Configuration (Post-Deploy)

### A. Update Vercel Environment Variable

1. In Vercel, go to: **Settings** → **Environment Variables**

2. Find `NEXT_PUBLIC_APP_URL` and click **Edit**

3. Change from:
   ```
   https://matalino-app.vercel.app
   ```
   To your **actual Vercel URL**:
   ```
   https://matalino-app-abc123.vercel.app
   ```
   *(Use the exact URL you got after deployment)*

4. Click **"Save"**

### B. Update Supabase Redirect URLs

1. Open new tab: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

2. **Add these Redirect URLs** (use your actual Vercel URL):
   ```
   https://matalino-app-abc123.vercel.app/auth/callback
   https://matalino-app-abc123.vercel.app
   ```

3. **Update Site URL**:
   ```
   https://matalino-app-abc123.vercel.app
   ```

4. Click **"Save"**

### C. Redeploy to Apply Changes

1. Back in Vercel, go to **Deployments**

2. Click **⋯** (three dots) on the latest deployment

3. Click **"Redeploy"**

4. Wait for the new deployment to finish (~1-2 minutes)

---

## Step 6: Test Your Live App! 🎉

### Visit Your App
Open your Vercel URL in a browser:
```
https://your-actual-url.vercel.app
```

### Test Authentication
1. Click **"Get Started"** or **"Sign In"**
2. Click **"Continue with Google"**
3. Sign in with: `jay.cadmus@innovixdynamix.com`
4. You should be redirected to the dashboard ✅

### Test Dashboard
- You should see the dashboard
- Products count: 0 (initially)
- Subscribers count: 0 (initially)

---

## Step 7: Set Up Stripe (Optional - Do This Later)

### Get Stripe Keys

1. Go to: https://stripe.com
2. Sign up with `jay.cadmus@innovixdynamix.com`
3. Switch to **Test Mode**
4. Go to **Developers** → **API Keys**
5. Copy:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Add to Vercel

1. Go to Vercel → **Settings** → **Environment Variables**
2. Add/Update:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```
3. Redeploy

### Configure Webhook

1. In Stripe: **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
4. Events: Select `checkout.session.completed`
5. Copy webhook secret: `whsec_...`
6. Add to Vercel as: `STRIPE_WEBHOOK_SECRET=whsec_...`
7. Redeploy

---

## ✅ Success Checklist

After completing the steps above:

- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Vercel URL copied and saved
- [ ] `NEXT_PUBLIC_APP_URL` updated with actual URL
- [ ] Supabase redirect URLs configured
- [ ] App redeployed with updated config
- [ ] Can visit app in browser
- [ ] Google OAuth login works
- [ ] Dashboard loads successfully

---

## 🆘 Troubleshooting

### "Build Failed"
**Check:**
- Did you add all REQUIRED environment variables?
- Is `NEXT_PUBLIC_SUPABASE_URL` spelled correctly?
- Look at build logs for specific error

### "Authentication Error"
**Check:**
- Did you update Supabase redirect URLs?
- Does the redirect URL match your Vercel URL exactly?
- Did you redeploy after updating `NEXT_PUBLIC_APP_URL`?

### "Blank Dashboard"
**This is normal!**
- You haven't created any products yet
- Everything is working if you can see the dashboard
- Go to Dashboard → Products to create your first product

---

## 🎯 Quick Copy/Paste Summary

### Required Environment Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://hpnmahfdjapnlnhhiqpf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm1haGZkamFwbmxuaGhpcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTg0OTYsImV4cCI6MjA1NTEzNDQ5Nn0.vnBm2s2nHH9mKbX3Xw8fwVbOUCeWzAQ-fD8kBhD5tEg
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### Supabase Auth Configuration URL:
```
https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration
```

---

## 📱 What's Next?

1. **Create Products**: Go to Dashboard → Products → Add Product
2. **Add Subscribers**: Go to Dashboard → Subscribers → Add Subscriber
3. **Set Up Stripe**: Follow Step 7 above
4. **Test Checkout**: Create a product and try buying it
5. **Custom Domain**: Add your own domain in Vercel settings

---

## 🎉 You're Live!

Once you complete these steps, your Matalino app will be:

✅ **Live on the internet**  
✅ **Secure with authentication**  
✅ **Connected to your database**  
✅ **Ready for users**  

**Time to complete**: 10-15 minutes  
**Difficulty**: Easy (just follow the steps)

---

*Need help? Check the troubleshooting section or the other guide files in your repo!*


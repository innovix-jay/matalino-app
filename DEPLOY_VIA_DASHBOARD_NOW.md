# 🚀 Deploy Matalino via Vercel Dashboard - RIGHT NOW

The CLI is having session issues, but you can deploy in 5 minutes through the dashboard!

---

## Step 1: Import Project (1 minute)

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**
   - You should see: `innovix-jay/matalino-app`
   - Click **"Import"**

---

## Step 2: Configure Project (2 minutes)

### Project Name
```
matalino-app
```

### Framework
- Should auto-detect: **Next.js** ✅

### Root Directory
```
./
```
(Leave as default)

### Build Command
```
npm run build
```
(Auto-filled ✅)

---

## Step 3: Add Environment Variables (2 minutes)

Click **"Environment Variables"** and add these **THREE REQUIRED** variables:

### ✅ Copy/Paste These Exactly:

#### 1. Supabase URL
**Name:**
```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:**
```
https://hpnmahfdjapnlnhhiqpf.supabase.co
```

#### 2. Supabase Anon Key
**Name:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm1haGZkamFwbmxuaGhpcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTg0OTYsImV4cCI6MjA1NTEzNDQ5Nn0.vnBm2s2nHH9mKbX3Xw8fwVbOUCeWzAQ-fD8kBhD5tEg
```

#### 3. App URL (Temporary)
**Name:**
```
NEXT_PUBLIC_APP_URL
```
**Value:**
```
https://matalino-app.vercel.app
```

### Environment Scope
Make sure ALL THREE are checked:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

---

## Step 4: Deploy! (Click the button)

1. Click **"Deploy"**
2. Wait 2-3 minutes (grab a coffee ☕)
3. **Copy your deployment URL** when it's done

---

## Step 5: Post-Deployment Configuration (3 minutes)

### A. Update App URL in Vercel

1. After deployment, you'll get a URL like: `https://matalino-app-abc123.vercel.app`
2. **Go to**: Settings → Environment Variables
3. **Edit** `NEXT_PUBLIC_APP_URL`
4. **Change to** your actual Vercel URL
5. **Save**

### B. Update Supabase Redirect URLs

1. **Go to**: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

2. **Add Redirect URLs** (replace with YOUR actual Vercel URL):
   ```
   https://your-actual-url.vercel.app/auth/callback
   https://your-actual-url.vercel.app
   ```

3. **Update Site URL**:
   ```
   https://your-actual-url.vercel.app
   ```

4. Click **"Save"**

### C. Redeploy with Updated Config

1. Back in Vercel → **Deployments**
2. Click **⋯** on latest deployment
3. Click **"Redeploy"**
4. Wait ~1 minute

---

## Step 6: Test Your App! 🎉

### Visit Your App
```
https://your-vercel-url.vercel.app
```

### Test Authentication
1. Click **"Get Started"** or **"Sign In"**
2. Click **"Continue with Google"**
3. Use: `jay.cadmus@innovixdynamix.com`
4. Should redirect to dashboard ✅

---

## ✅ Success Checklist

After completing:

- [ ] Project imported from GitHub
- [ ] 3 environment variables added
- [ ] Deployment successful (got a URL)
- [ ] `NEXT_PUBLIC_APP_URL` updated with actual URL
- [ ] Supabase redirect URLs configured
- [ ] Redeployed
- [ ] Can visit app in browser
- [ ] Google OAuth login works
- [ ] Dashboard loads

---

## 🎯 Quick Copy/Paste Summary

### Environment Variables:
```bash
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://hpnmahfdjapnlnhhiqpf.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm1haGZkamFwbmxuaGhpcXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTg0OTYsImV4cCI6MjA1NTEzNDQ5Nn0.vnBm2s2nHH9mKbX3Xw8fwVbOUCeWzAQ-fD8kBhD5tEg

Name: NEXT_PUBLIC_APP_URL
Value: https://matalino-app.vercel.app
```

### Supabase Config URL:
```
https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration
```

---

## 🆘 If Something Goes Wrong

### Build Failed
- Check all 3 env vars are added correctly
- Check spelling of variable names
- Look at build logs for specific error

### Can't Access Dashboard
- Did you update `NEXT_PUBLIC_APP_URL`?
- Did you add Supabase redirect URLs?
- Did you redeploy after updating?

### Authentication Error
- Verify redirect URLs in Supabase match your Vercel URL **exactly**
- No trailing slashes
- Include `/auth/callback`

---

## 🎉 You're Almost There!

**Total Time**: ~10 minutes  
**Difficulty**: Easy (just copy/paste)  
**Cost**: $0 (Free tier)

**Start Here**: https://vercel.com/new

---

*Let me know once you click "Deploy" and I'll help with the post-deployment steps!*


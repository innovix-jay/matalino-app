# 🔧 FIX GOOGLE OAUTH - IMMEDIATE ACTION REQUIRED

## 🎯 **Problem Identified**

The Google OAuth is failing because:

1. ❌ **Vercel Environment Variable** is set to old URL: `https://src-jay-cadmus-projects-02376606.vercel.app`
2. ❌ **Supabase Redirect URLs** likely don't include `matalino.online` and `www.matalino.online`

## ⚡ **FIX STEP 1: Update Vercel Environment Variable**

### **Via Vercel Dashboard (EASIEST):**

1. **Go to:** https://vercel.com/jay-cadmus-projects-02376606/src/settings/environment-variables

2. **Find:** `NEXT_PUBLIC_APP_URL`

3. **Click:** "..." → "Edit"

4. **Change FROM:**
   ```
   https://src-jay-cadmus-projects-02376606.vercel.app
   ```

5. **Change TO:**
   ```
   https://matalino.online
   ```

6. **Click "Save"**

### **Via CLI (Alternative):**

```bash
# Remove old value
vercel env rm NEXT_PUBLIC_APP_URL production

# Add new value
vercel env add NEXT_PUBLIC_APP_URL production
# When prompted, enter: https://matalino.online
```

---

## ⚡ **FIX STEP 2: Update Supabase Redirect URLs**

### **Go to Supabase Auth Configuration:**
https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

### **Add These Redirect URLs** (Click "Add URL" for each):

```
https://matalino.online/auth/callback
https://www.matalino.online/auth/callback
```

### **Update Site URL:**
```
https://matalino.online
```

### **Click "Save"** at the bottom!

---

## ⚡ **FIX STEP 3: Redeploy Application**

After updating both Vercel and Supabase:

```bash
vercel --prod --force
```

This will:
- Rebuild with new environment variable
- Deploy to production
- Make OAuth work with matalino.online

---

## ✅ **TEST AFTER DEPLOYMENT**

1. **Wait 2-3 minutes** for deployment to complete

2. **Visit:** https://matalino.online/auth/login

3. **Click:** "Continue with Google"

4. **Expected Flow:**
   - Redirects to Google
   - You authorize the app
   - Redirects back to: `https://matalino.online/auth/callback`
   - Processes auth
   - Redirects to: `https://matalino.online/dashboard`
   - You're logged in! ✅

5. **Dashboard should show:**
   - Your email: jay.cadmus@innovixdynamix.com
   - Products: 1
   - Subscribers: 2

---

## 🔍 **If Still Not Working**

### **Check Browser Console:**
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for red errors
4. Share any errors you see

### **Check Network Tab:**
1. F12 → Network tab
2. Click "Continue with Google"
3. Look for failed requests (red)
4. Check if redirect URL is correct

### **Test Email/Password First:**
1. Visit: https://matalino.online/test-auth
2. Email: `jay.cadmus@innovixdynamix.com`
3. Password: `Jaychanti78!`
4. If this works, OAuth issue is definitely redirect URLs

---

## 📊 **Current vs. Correct Configuration**

### **Current (WRONG):**
```
NEXT_PUBLIC_APP_URL = https://src-jay-cadmus-projects-02376606.vercel.app
OAuth Redirect = https://src-jay-cadmus-projects-02376606.vercel.app/auth/callback
```

### **Correct (NEEDED):**
```
NEXT_PUBLIC_APP_URL = https://matalino.online
OAuth Redirect = https://matalino.online/auth/callback
```

---

## 🎯 **QUICK CHECKLIST**

- [ ] Updated `NEXT_PUBLIC_APP_URL` to `https://matalino.online` in Vercel
- [ ] Added `https://matalino.online/auth/callback` to Supabase
- [ ] Added `https://www.matalino.online/auth/callback` to Supabase
- [ ] Updated Site URL to `https://matalino.online` in Supabase
- [ ] Clicked "Save" in Supabase
- [ ] Ran `vercel --prod --force`
- [ ] Waited for deployment to complete
- [ ] Tested Google OAuth login

---

## 🚀 **After OAuth Works**

Once Google login is working:

1. ✅ Test thoroughly (different browsers, incognito)
2. ✅ Verify dashboard loads correctly
3. ✅ Move on to **Stripe integration setup**

---

**🎯 BOTTOM LINE: Update the environment variable in Vercel + Add redirect URLs in Supabase + Redeploy = OAuth will work!**

# 🔧 DNS FIX: SSL Certificate Issue for matalino.online

## 🎯 **Problem Identified**

Your site has a DNS misconfiguration:
- ✅ **www.matalino.online** - Working correctly with HTTPS (points to Vercel)
- ❌ **matalino.online** - Points to Cloudflare/Render instead of Vercel (causing SSL errors)

## 🚨 **Root Cause**

The DNS A record for `matalino.online` is currently pointing to the wrong server (Cloudflare/Render), not Vercel. This causes:
1. SSL certificate errors when accessing the root domain
2. Users can't log in when redirected to the root domain
3. Inconsistent behavior between www and non-www URLs

## ✅ **Solution Applied to Code**

I've already updated your code to:
1. ✅ Updated `.env.production` to use `https://www.matalino.online`
2. ✅ Added automatic redirect from `matalino.online` → `www.matalino.online` in `next.config.js`
3. ✅ All OAuth redirects will now use the www subdomain with valid SSL

## 🌐 **DNS Configuration Required**

You need to update your DNS records at your domain registrar. Here's what to do:

### **Option A: Point Both to Vercel (Recommended)**

#### **1. Update Root Domain A Record:**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### **2. Keep WWW CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### **Option B: Use Vercel Nameservers (Best for Long-term)**

Change your domain's nameservers to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

This gives Vercel full DNS control and auto-configures everything.

## 📋 **Step-by-Step DNS Update Guide**

### **Step 1: Find Your Domain Registrar**

Where did you purchase `matalino.online`? Common registrars:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Porkbun

### **Step 2: Access DNS Settings**

1. Log in to your domain registrar
2. Find DNS Management / DNS Settings / Nameserver Settings
3. Look for existing A records or CNAME records

### **Step 3: Update the Root Domain A Record**

**Current (Incorrect) Configuration:**
- Your root domain is pointing to Cloudflare/Render

**New (Correct) Configuration:**
```
Type: A
Host: @ (or root or leave blank)
Value: 76.76.21.21
TTL: 3600
```

**Important:** Delete or replace any existing A record for the root domain!

### **Step 4: Verify WWW CNAME (Should Already Be Correct)**

```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

### **Step 5: Save Changes and Wait**

- Save your DNS changes
- DNS propagation takes 5-60 minutes (sometimes up to 24 hours)
- Check status: https://dnschecker.org/#A/matalino.online

## 🔍 **Verify DNS is Fixed**

### **Command Line Check:**
```bash
# Check root domain
curl -I https://matalino.online

# Should show:
# - HTTP/2 200 or 308 (redirect)
# - server: Vercel
# - Valid SSL certificate

# Check www subdomain
curl -I https://www.matalino.online

# Should show:
# - HTTP/2 200
# - server: Vercel
# - Valid SSL certificate
```

### **Browser Check:**
1. Visit https://matalino.online (should redirect to www)
2. Visit https://www.matalino.online (should load directly)
3. Both should show 🔒 (secure lock icon)
4. Try logging in - should work without SSL warnings

## ⚙️ **Vercel Dashboard Configuration**

After DNS is fixed, verify in Vercel:

### **1. Check Domain Status:**
Visit: https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains

**Should show:**
- ✅ `matalino.online` - Valid
- ✅ `www.matalino.online` - Valid

### **2. Update Environment Variables:**
Visit: https://vercel.com/jay-cadmus-projects-02376606/src/settings/environment-variables

**Update/Add:**
```
Key: NEXT_PUBLIC_APP_URL
Value: https://www.matalino.online
Environments: Production, Preview, Development
```

### **3. Trigger Redeployment:**
```bash
# Option A: Via GitHub
git push origin main

# Option B: Via Vercel Dashboard
# Go to Deployments → Click "..." → Redeploy
```

## 🔐 **Supabase Auth Configuration**

Update your Supabase redirect URLs to include the www subdomain:

Visit: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

**Add these Redirect URLs:**
```
https://www.matalino.online/auth/callback
https://matalino.online/auth/callback
http://localhost:3000/auth/callback
```

**Update Site URL:**
```
https://www.matalino.online
```

**Save Changes**

## 🧪 **Testing Checklist**

After DNS propagation completes:

- [ ] Visit https://matalino.online → should redirect to https://www.matalino.online
- [ ] Visit https://www.matalino.online → should load homepage with 🔒 secure icon
- [ ] No SSL certificate warnings in browser
- [ ] Click "Sign In" → should go to https://www.matalino.online/auth/login
- [ ] Try Google OAuth → should redirect properly and log in successfully
- [ ] Try email/password login → should work without SSL errors
- [ ] After login, check URL → should be https://www.matalino.online/dashboard
- [ ] Open browser DevTools → Console → No SSL or CORS errors

## 🚨 **Common Issues & Solutions**

### **Issue: "DNS not propagating"**
**Solution:**
- Clear your browser cache
- Use incognito mode
- Try different device/network
- Check https://dnschecker.org/#A/matalino.online

### **Issue: "Still seeing SSL errors"**
**Solution:**
- Verify DNS points to 76.76.21.21
- Wait 5-10 more minutes for SSL provisioning
- Clear browser cache
- Check Vercel domain status

### **Issue: "Login redirects to wrong URL"**
**Solution:**
- Verify NEXT_PUBLIC_APP_URL in Vercel environment variables
- Check Supabase redirect URLs
- Redeploy application
- Clear cookies

### **Issue: "Root domain still shows 405 error"**
**Solution:**
- DNS A record is not updated yet
- Check your registrar's DNS settings
- Ensure A record points to 76.76.21.21 (not Cloudflare/Render IP)

## 📊 **Current vs. Correct DNS Configuration**

### **Current (Broken) Setup:**
```
matalino.online → Cloudflare/Render (❌ SSL error)
www.matalino.online → Vercel (✅ Works)
```

### **After DNS Fix:**
```
matalino.online → Vercel → Redirects to www (✅ Works)
www.matalino.online → Vercel (✅ Works)
```

## 🎯 **What I've Already Fixed in the Code**

1. ✅ **Updated `.env.production`**: Changed APP_URL to `https://www.matalino.online`
2. ✅ **Added Redirect Rule**: Automatically redirects non-www to www in `next.config.js`
3. ✅ **OAuth Configuration**: Uses correct domain for OAuth callbacks
4. ✅ **Security Headers**: HSTS and other security headers already configured

## 🚀 **Timeline for Full Resolution**

1. **NOW**: Code changes are committed (ready for deployment)
2. **5 minutes**: Update DNS A record at your registrar
3. **5-60 minutes**: Wait for DNS propagation
4. **2 minutes**: Update Vercel environment variables
5. **3 minutes**: Update Supabase redirect URLs
6. **5 minutes**: Trigger Vercel redeployment
7. **DONE**: Test login flow - should work perfectly!

**Total time: ~20-80 minutes** (depending on DNS propagation)

## 📞 **Need Help?**

### **Check DNS Propagation:**
```bash
# Online tool (easiest)
https://dnschecker.org/#A/matalino.online

# Should show: 76.76.21.21 (Vercel IP)
```

### **Verify Vercel Status:**
- Dashboard: https://vercel.com/jay-cadmus-projects-02376606/src
- Domains: https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains
- Status: https://www.vercel-status.com/

### **Test Login Flow:**
1. Open incognito window
2. Go to https://www.matalino.online
3. Click "Sign In"
4. Try Google OAuth or email/password
5. Should redirect to dashboard successfully

---

## 🎯 **Bottom Line**

**The code is now configured correctly. You just need to:**
1. **Update DNS A record** for `matalino.online` to point to `76.76.21.21`
2. **Wait for DNS propagation** (5-60 minutes)
3. **Update Vercel environment variables** to use `https://www.matalino.online`
4. **Update Supabase redirect URLs**
5. **Redeploy on Vercel**
6. **Test login** - should work perfectly!

**The SSL certificate will automatically provision once DNS is correct.**

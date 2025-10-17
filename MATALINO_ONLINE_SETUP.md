# 🚀 Production Setup: matalino.online

## ⚡ **Quick Setup Guide**

Your custom domain `matalino.online` is ready to be configured! Follow these steps in order.

---

## 🎯 **Step 1: Add Domain in Vercel Dashboard**

### **Go to Domain Settings:**
https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains

### **Add Domain:**
1. Click **"Add Domain"** button
2. Enter: `matalino.online`
3. Click **"Add"**

### **Vercel Will Prompt You to Configure DNS:**

You have **3 options** (choose one):

#### **Option A: A Record (Recommended for simplicity)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### **Option B: CNAME Record**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### **Option C: Vercel Nameservers (Recommended for advanced users)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### **Also Add WWW Subdomain (Optional):**
1. Click **"Add Domain"** again
2. Enter: `www.matalino.online`
3. Vercel will auto-configure redirect to root domain

---

## 🌐 **Step 2: Configure DNS at Your Domain Registrar**

### **Where to Update DNS:**

Find your domain registrar (where you bought matalino.online):
- GoDaddy: DNS Management
- Namecheap: Advanced DNS
- Cloudflare: DNS Settings
- Google Domains: DNS Settings

### **Add the DNS Record from Step 1:**

**Most Common Setup (A Record):**
```
Type: A
Host/Name: @ (or leave blank for root)
Value/Points to: 76.76.21.21
TTL: 3600 (or Auto)
```

### **DNS Propagation:**
- Takes **5-60 minutes** typically
- Can take up to **48 hours** in rare cases
- Check status: https://dnschecker.org/#A/matalino.online

---

## 🔐 **Step 3: Update Supabase Auth Configuration**

### **Add Custom Domain Redirect URLs:**

Go to: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

**Click "Add Redirect URL" and add these one by one:**

```
https://matalino.online/auth/callback
https://www.matalino.online/auth/callback
```

**Keep the existing Vercel URLs too:**
```
https://src-4zx4wrdgp-jay-cadmus-projects-02376606.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Update Site URL:**
```
https://matalino.online
```

**Scroll down and click "Save"**

---

## ⚙️ **Step 4: Update Vercel Environment Variables**

### **Go to Environment Variables:**
https://vercel.com/jay-cadmus-projects-02376606/src/settings/environment-variables

### **Update NEXT_PUBLIC_APP_URL:**

1. Find `NEXT_PUBLIC_APP_URL` in the list
2. Click the **"..."** menu → **"Edit"**
3. Change value to: `https://matalino.online`
4. Make sure it's enabled for: **Production, Preview, Development**
5. Click **"Save"**

**Or add it if it doesn't exist:**
- Key: `NEXT_PUBLIC_APP_URL`
- Value: `https://matalino.online`
- Environment: Production, Preview, Development

---

## 🚀 **Step 5: Redeploy Application**

### **Trigger Production Deployment:**

**Option A: Via CLI (Recommended)**
```bash
vercel --prod
```

**Option B: Via Dashboard**
1. Go to: https://vercel.com/jay-cadmus-projects-02376606/src
2. Click **"Deployments"** tab
3. Find latest deployment
4. Click **"..."** menu → **"Redeploy"**
5. Select **"Use existing Build Cache"** (optional)
6. Click **"Redeploy"**

---

## ✅ **Step 6: Verify Everything Works**

### **Wait for DNS Propagation:**
- Check: https://dnschecker.org/#A/matalino.online
- Should show Vercel IP: `76.76.21.21`
- Wait until most locations are green ✅

### **Test Custom Domain:**

#### **1. Homepage:**
- Visit: https://matalino.online
- Should load without errors
- SSL certificate should be valid (🔒 in browser)

#### **2. Authentication:**
- Visit: https://matalino.online/auth/login
- Click "Continue with Google"
- Should redirect to Google OAuth
- After auth, should redirect back to dashboard
- URL should be: https://matalino.online/dashboard

#### **3. Test Page:**
- Visit: https://matalino.online/test-auth
- Test email/password login: jay.cadmus@innovixdynamix.com / Jaychanti78!
- Should login successfully

#### **4. Dashboard:**
- Visit: https://matalino.online/dashboard
- Should show your email and user data
- Products and subscribers should display

---

## 🔧 **Troubleshooting**

### **Domain Not Loading:**

1. **Check DNS propagation:**
   ```bash
   nslookup matalino.online
   ```
   Should return Vercel IP

2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Or use Incognito mode

3. **Check Vercel domain status:**
   https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains
   - Should show: "Valid" with green checkmark

### **SSL Certificate Issues:**

- Vercel auto-provisions SSL certificates
- Takes 5-10 minutes after DNS propagation
- If not working after 30 minutes, contact Vercel support

### **OAuth Not Working:**

1. **Verify Supabase redirect URLs include matalino.online**
2. **Check environment variables in Vercel**
3. **Clear browser cookies**
4. **Test in incognito mode**

### **502/504 Gateway Errors:**

```bash
# Force rebuild and redeploy
vercel --prod --force
```

---

## 📊 **Current Configuration**

### **Supabase Project:**
- URL: `https://hpnmahfdjapnlnhhiqpf.supabase.co`
- Project: matalino-prod

### **Current Vercel URLs:**
- Latest: `https://src-4zx4wrdgp-jay-cadmus-projects-02376606.vercel.app`
- Previous: `https://src-7xof982ac-jay-cadmus-projects-02376606.vercel.app`

### **Target Production Domain:**
- Main: `https://matalino.online`
- WWW: `https://www.matalino.online`

### **Authentication Endpoints:**
- Login: `/auth/login`
- Signup: `/auth/signup`
- Callback: `/auth/callback`
- Dashboard: `/dashboard`

---

## 🎯 **After Setup Checklist**

- [ ] Domain added in Vercel
- [ ] DNS records configured at registrar
- [ ] DNS propagation complete (check dnschecker.org)
- [ ] Supabase redirect URLs updated
- [ ] Vercel environment variables updated
- [ ] Application redeployed
- [ ] Homepage loads at https://matalino.online
- [ ] SSL certificate valid
- [ ] Google OAuth works
- [ ] Email/password login works
- [ ] Dashboard displays user data
- [ ] No console errors in browser

---

## 🚀 **Next Steps After Domain Is Live**

1. ✅ **Verify authentication works on custom domain**
2. 🎨 **Setup Stripe with custom domain URLs**
3. 📧 **Configure email notifications (optional)**
4. 📊 **Setup analytics and monitoring**
5. 🎉 **Launch and promote!**

---

## 💡 **Pro Tips**

### **Use Production URL in All Configs:**
Once matalino.online is live, update all external services to use it:
- Google OAuth app (authorized domains)
- Stripe return URLs
- Email templates
- Marketing materials

### **Keep Vercel URLs as Fallback:**
Keep the Vercel preview URLs in Supabase for testing deployments

### **Monitor Performance:**
- Enable Vercel Analytics
- Setup Vercel Speed Insights
- Configure uptime monitoring

---

## 📞 **Need Help?**

### **Check Deployment Status:**
```bash
vercel domains ls
vercel domains inspect matalino.online
vercel logs matalino.online
```

### **Vercel Support:**
- Dashboard: https://vercel.com/support
- Status: https://www.vercel-status.com/

### **Supabase Support:**
- Dashboard: https://supabase.com/dashboard/support
- Docs: https://supabase.com/docs

---

**🎯 Bottom Line: Add domain in Vercel Dashboard → Configure DNS → Update Supabase → Redeploy → Done!**

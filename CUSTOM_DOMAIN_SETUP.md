# 🌐 Custom Domain Setup: matalino.online

## 🎯 **Overview**

Complete guide to configure `matalino.online` as your production domain for Matalino platform with Vercel and Supabase.

---

## 📋 **Setup Steps**

### **1. Configure Domain in Vercel**

#### **Add Domain to Vercel Project:**

1. **Go to Vercel Dashboard:**
   https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains

2. **Add Domain:**
   - Click "Add Domain"
   - Enter: `matalino.online`
   - Click "Add"

3. **Add WWW Subdomain (Optional but Recommended):**
   - Click "Add Domain" again
   - Enter: `www.matalino.online`
   - Set to redirect to `matalino.online`

#### **Configure DNS Records:**

You'll need to add these DNS records to your domain registrar:

**For Root Domain (matalino.online):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For WWW (www.matalino.online):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Or use Vercel Nameservers (Recommended):**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

### **2. Update Supabase Auth Configuration**

#### **Redirect URLs:**

Go to: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration

**Add these Redirect URLs:**
```
https://matalino.online/auth/callback
https://www.matalino.online/auth/callback
https://src-4zx4wrdgp-jay-cadmus-projects-02376606.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Site URL:**
```
https://matalino.online
```

**Additional Redirect URLs (for testing):**
```
https://matalino.online/*
https://www.matalino.online/*
```

---

### **3. Update Vercel Environment Variables**

Run these commands or update via Vercel Dashboard:

```bash
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://matalino.online

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: https://hpnmahfdjapnlnhhiqpf.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Enter: [Your Supabase Anon Key]
```

---

### **4. Update Application Code**

No code changes needed! The app already uses `NEXT_PUBLIC_APP_URL` environment variable.

---

### **5. Deploy Changes**

After configuring domain and environment variables:

```bash
vercel --prod
```

---

## 🧪 **Testing Checklist**

### **DNS Propagation:**
- [ ] Check DNS: https://dnschecker.org/#A/matalino.online
- [ ] Verify A record points to Vercel
- [ ] Wait 5-60 minutes for DNS propagation

### **Domain Access:**
- [ ] Visit: https://matalino.online
- [ ] Should show Matalino homepage
- [ ] SSL certificate should be valid
- [ ] No security warnings

### **Authentication:**
- [ ] Visit: https://matalino.online/auth/login
- [ ] Test Google OAuth
- [ ] Test email/password login
- [ ] Should redirect to https://matalino.online/dashboard

### **Dashboard:**
- [ ] Visit: https://matalino.online/dashboard
- [ ] Shows user data
- [ ] No authentication errors

---

## 🔧 **Vercel CLI Commands**

### **Check Domain Status:**
```bash
vercel domains ls
```

### **Inspect Domain:**
```bash
vercel domains inspect matalino.online
```

### **Add Domain via CLI:**
```bash
vercel domains add matalino.online --yes
```

### **View Current Deployment:**
```bash
vercel ls
```

---

## 🎯 **Complete URLs After Setup**

### **Production Site:**
- Main: https://matalino.online
- WWW: https://www.matalino.online (redirects to main)

### **Authentication:**
- Login: https://matalino.online/auth/login
- Signup: https://matalino.online/auth/signup
- Callback: https://matalino.online/auth/callback

### **Dashboard:**
- Main: https://matalino.online/dashboard
- Products: https://matalino.online/dashboard/products
- Subscribers: https://matalino.online/dashboard/subscribers

### **Testing:**
- Auth Test: https://matalino.online/test-auth
- Debug: https://matalino.online/debug-auth

---

## 🔍 **Troubleshooting**

### **Domain Not Working:**

1. **Check DNS propagation:**
   ```bash
   nslookup matalino.online
   ```

2. **Verify Vercel configuration:**
   - Go to Vercel Dashboard → Domains
   - Check if domain shows as "Valid"

3. **Check SSL certificate:**
   - Vercel automatically provisions SSL
   - May take 5-10 minutes after DNS propagation

### **Authentication Failing:**

1. **Verify Supabase redirect URLs include custom domain**
2. **Check environment variables in Vercel**
3. **Clear browser cache and cookies**
4. **Test in incognito mode**

### **502/504 Errors:**

1. **Redeploy application:**
   ```bash
   vercel --prod --force
   ```

2. **Check Vercel deployment logs:**
   ```bash
   vercel logs matalino.online
   ```

---

## 🚀 **Post-Setup Tasks**

### **Update External Links:**
- [ ] Update Google OAuth authorized domains
- [ ] Update Stripe return URLs (when configured)
- [ ] Update any marketing materials
- [ ] Update social media links

### **SEO Configuration:**
- [ ] Add Google Search Console
- [ ] Submit sitemap
- [ ] Verify domain ownership

### **Monitoring:**
- [ ] Set up Vercel Analytics
- [ ] Configure custom domain in Vercel Speed Insights
- [ ] Set up uptime monitoring

---

## 📧 **Email Configuration (Optional)**

If you want to send emails from @matalino.online:

1. **Add MX Records** for email provider
2. **Add SPF Record:**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.google.com ~all
   ```

3. **Add DKIM Record** (from email provider)

---

## ✅ **Success Indicators**

- ✅ https://matalino.online loads your app
- ✅ SSL certificate is valid (🔒 in browser)
- ✅ Google OAuth redirects properly
- ✅ Dashboard shows user data
- ✅ No console errors
- ✅ All routes work correctly

---

## 🎯 **Next Steps After Domain Setup**

1. **Test complete authentication flow**
2. **Verify all features work on custom domain**
3. **Setup Stripe with custom domain**
4. **Configure email notifications**
5. **Launch! 🚀**

---

**Your production site will be live at https://matalino.online once DNS propagates!**

# ✅ Custom Domain Deployment Checklist: matalino.online

## 🎯 **Complete Setup Workflow**

Follow these steps in order to deploy your app on **matalino.online**:

---

## ✅ **STEP 1: Vercel Domain Configuration**

### **1.1 Add Domain in Vercel**

- [ ] Go to: https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains
- [ ] Click "Add Domain"
- [ ] Enter: `matalino.online`
- [ ] Click "Add"
- [ ] Note the DNS configuration instructions Vercel provides

### **1.2 Add WWW Subdomain (Optional)**

- [ ] Click "Add Domain" again
- [ ] Enter: `www.matalino.online`
- [ ] Vercel will auto-configure redirect

---

## ✅ **STEP 2: DNS Configuration**

### **2.1 Access Your Domain Registrar**

- [ ] Go to your domain registrar where you bought matalino.online
- [ ] Find DNS Management/Settings section

### **2.2 Add A Record**

Add this DNS record:

```
Type: A
Host/Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

### **2.3 Add WWW CNAME (If using www)**

```
Type: CNAME
Host/Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### **2.4 Wait for DNS Propagation**

- [ ] Wait 5-60 minutes (typically)
- [ ] Check status: https://dnschecker.org/#A/matalino.online
- [ ] Should show IP: 76.76.21.21

---

## ✅ **STEP 3: Supabase Configuration**

### **3.1 Update Redirect URLs**

- [ ] Go to: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration
- [ ] Click "Add URL" for each of these:

```
https://matalino.online/auth/callback
https://www.matalino.online/auth/callback
```

- [ ] Keep existing URLs (Vercel and localhost)
- [ ] **IMPORTANT:** Click "Save" at bottom

### **3.2 Update Site URL**

- [ ] In the same page, find "Site URL" field
- [ ] Update to: `https://matalino.online`
- [ ] Click "Save"

---

## ✅ **STEP 4: Update Environment Variables**

### **4.1 Update via Vercel Dashboard**

- [ ] Go to: https://vercel.com/jay-cadmus-projects-02376606/src/settings/environment-variables
- [ ] Find `NEXT_PUBLIC_APP_URL`
- [ ] Click "..." → "Edit"
- [ ] Change value to: `https://matalino.online`
- [ ] Click "Save"

### **4.2 Verify Other Variables**

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://hpnmahfdjapnlnhhiqpf.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (should be set)
- [ ] All should be enabled for: Production, Preview, Development

---

## ✅ **STEP 5: Deploy Updated Code**

### **5.1 Commit Changes**

```bash
git add .
git commit -m "feat: configure custom domain matalino.online"
git push
```

### **5.2 Deploy to Production**

```bash
vercel --prod
```

- [ ] Wait for deployment to complete
- [ ] Note the deployment URL

---

## ✅ **STEP 6: Verification & Testing**

### **6.1 Check Domain Status**

- [ ] Visit: https://matalino.online
- [ ] Page should load
- [ ] SSL certificate valid (🔒 in browser)
- [ ] No security warnings

### **6.2 Test Authentication Flow**

#### **Email/Password Test:**
- [ ] Visit: https://matalino.online/test-auth
- [ ] Email: `jay.cadmus@innovixdynamix.com`
- [ ] Password: `Jaychanti78!`
- [ ] Click "Test Email Login"
- [ ] Should login successfully

#### **Google OAuth Test:**
- [ ] Visit: https://matalino.online/auth/login
- [ ] Click "Continue with Google"
- [ ] Should redirect to Google
- [ ] After auth, should redirect to: https://matalino.online/dashboard
- [ ] No errors in console

### **6.3 Test Dashboard**

- [ ] Visit: https://matalino.online/dashboard
- [ ] Should display your email
- [ ] Should show products and subscribers
- [ ] Data should load correctly

### **6.4 Test Debug Pages**

- [ ] Visit: https://matalino.online/debug-auth
- [ ] Should show Supabase configuration
- [ ] Click "Test Google OAuth"
- [ ] Should work without errors

---

## ✅ **STEP 7: Final Checks**

### **7.1 Browser Testing**

- [ ] Chrome/Edge (logged out)
- [ ] Chrome Incognito
- [ ] Firefox (if available)
- [ ] Mobile browser (if available)

### **7.2 Console Checks**

- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Should have no red errors
- [ ] Network tab shows successful requests

### **7.3 SSL Certificate**

- [ ] Click lock icon in browser address bar
- [ ] Certificate should be valid
- [ ] Issued by: Let's Encrypt or Vercel
- [ ] Valid for matalino.online

---

## ✅ **STEP 8: Post-Launch Tasks**

### **8.1 Update External Services**

- [ ] Google OAuth app (add matalino.online as authorized domain)
- [ ] Stripe dashboard (update return URLs when configured)
- [ ] Any email templates with links
- [ ] Marketing materials

### **8.2 Setup Monitoring**

- [ ] Enable Vercel Analytics
- [ ] Enable Vercel Speed Insights
- [ ] Setup uptime monitoring (optional)

### **8.3 SEO Configuration**

- [ ] Google Search Console verification
- [ ] Submit sitemap
- [ ] Update social media links

---

## 🔧 **Troubleshooting Guide**

### **Issue: Domain Not Loading**

**Solution:**
1. Check DNS propagation: https://dnschecker.org
2. Verify Vercel domain shows "Valid"
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito mode

### **Issue: SSL Certificate Invalid**

**Solution:**
1. Wait 10-15 minutes for Vercel to provision certificate
2. Check Vercel domain settings
3. Verify DNS is pointing to Vercel correctly

### **Issue: OAuth Redirecting to Wrong URL**

**Solution:**
1. Verify Supabase redirect URLs include matalino.online
2. Check NEXT_PUBLIC_APP_URL in Vercel env vars
3. Clear browser cookies
4. Test in incognito mode

### **Issue: 502/504 Gateway Errors**

**Solution:**
```bash
vercel --prod --force
```

### **Issue: Dashboard Not Loading**

**Solution:**
1. Check browser console for errors
2. Verify environment variables in Vercel
3. Check Supabase connection
4. View deployment logs: `vercel logs matalino.online`

---

## 📊 **Expected Results**

### **URLs After Setup:**

- **Homepage:** https://matalino.online
- **Login:** https://matalino.online/auth/login
- **Signup:** https://matalino.online/auth/signup
- **Dashboard:** https://matalino.online/dashboard
- **Test Auth:** https://matalino.online/test-auth

### **Authentication Flow:**

1. User clicks "Continue with Google"
2. Redirects to Google OAuth
3. User authorizes app
4. Redirects to: https://matalino.online/auth/callback
5. Processes auth code
6. Redirects to: https://matalino.online/dashboard
7. Dashboard shows user data

### **User Experience:**

- ✅ Fast page loads
- ✅ Smooth authentication
- ✅ No console errors
- ✅ Data displays correctly
- ✅ Professional look with custom domain

---

## 🎯 **Success Criteria**

All of these should be TRUE:

- ✅ https://matalino.online loads successfully
- ✅ SSL certificate is valid
- ✅ Google OAuth login works
- ✅ Email/password login works
- ✅ Dashboard displays user data
- ✅ No console errors
- ✅ All routes work correctly
- ✅ Mobile responsive
- ✅ Fast load times (<3 seconds)

---

## 📞 **Support Resources**

### **Vercel CLI Commands:**

```bash
# Check domain status
vercel domains ls

# View deployment logs
vercel logs matalino.online

# Force redeploy
vercel --prod --force

# Check project status
vercel ls
```

### **DNS Check Commands:**

```bash
# Check DNS resolution
nslookup matalino.online

# Check with dig (if available)
dig matalino.online

# Check A record
nslookup -type=A matalino.online
```

### **Documentation:**

- **Vercel Domains:** https://vercel.com/docs/concepts/projects/domains
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **DNS Guide:** https://vercel.com/docs/concepts/projects/domains/add-a-domain

---

## 🚀 **After Everything Works**

Once all checks pass:

1. ✅ **Test thoroughly** (30 minutes)
2. ✅ **Document any issues** encountered
3. ✅ **Setup Stripe** with custom domain
4. ✅ **Configure email** notifications
5. ✅ **Launch announcement** 🎉

---

## 📝 **Notes**

- Keep Vercel preview URLs in Supabase for testing
- DNS changes can take up to 48 hours (rare)
- Vercel provides free SSL certificates
- Monitor first few hours for any issues
- Have backup plan (revert to Vercel URL if needed)

---

**🎯 Once this checklist is complete, your app will be live at https://matalino.online!**

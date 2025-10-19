# 🔐 Supabase Auth Configuration for matalino.online

## 🎯 **Overview**

After fixing the DNS, you need to update Supabase to allow authentication callbacks from your custom domain.

## 🌐 **Redirect URLs to Add**

Go to: **https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration**

### **1. Click "Add Redirect URL" and add these one by one:**

```
https://www.matalino.online/auth/callback
https://matalino.online/auth/callback
http://localhost:3000/auth/callback
```

**Note:** Keep any existing Vercel URLs for preview deployments:
```
https://src-4zx4wrdgp-jay-cadmus-projects-02376606.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

### **2. Update Site URL:**

Change the Site URL to:
```
https://www.matalino.online
```

### **3. Additional Redirect URLs (Wildcard for flexibility):**

```
https://www.matalino.online/*
https://matalino.online/*
```

### **4. Save Changes**

Click **"Save"** at the bottom of the page.

## ⚙️ **Supabase Auth Settings**

### **Email Auth Settings:**
- Email Confirmation: Enabled
- Email Change Confirmation: Enabled
- Secure Email Change: Enabled

### **OAuth Settings:**

#### **Google OAuth Provider:**
1. Go to: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/providers
2. Find Google provider
3. Verify these settings:
   - **Enabled**: ✅
   - **Authorized redirect URIs** in Google Console should include:
     ```
     https://hpnmahfdjapnlnhhiqpf.supabase.co/auth/v1/callback
     ```

## 🔒 **Security Settings**

### **JWT Settings:**
- JWT expiry: 3600 seconds (1 hour)
- Refresh token rotation: Enabled
- Reuse interval: 10 seconds

### **Email Templates (Optional):**
Update email templates to use your custom domain:

```
Confirmation: https://www.matalino.online/auth/confirm
Reset Password: https://www.matalino.online/auth/reset-password
Magic Link: https://www.matalino.online/auth/login
```

## 🧪 **Testing After Configuration**

### **1. Test Google OAuth:**
```
1. Go to https://www.matalino.online/auth/login
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to: https://www.matalino.online/auth/callback
5. Then redirect to: https://www.matalino.online/dashboard
6. Check browser console - no errors
```

### **2. Test Email/Password:**
```
1. Go to https://www.matalino.online/auth/login
2. Enter email and password
3. Click "Sign In"
4. Should redirect to: https://www.matalino.online/dashboard
5. No SSL warnings
```

### **3. Test Sign Out:**
```
1. In dashboard, click "Sign Out"
2. Should redirect to: https://www.matalino.online
3. Session should be cleared
4. Try accessing dashboard - should redirect to login
```

## 🚨 **Common Issues**

### **Issue: "Invalid redirect URL"**
**Cause:** Redirect URL not in Supabase allowed list
**Solution:**
- Double-check URL is added in Supabase dashboard
- Ensure no typos (https vs http, www vs non-www)
- Wait 1-2 minutes for changes to propagate

### **Issue: "OAuth callback not working"**
**Cause:** Google OAuth not configured for custom domain
**Solution:**
- Supabase handles OAuth callback automatically
- Verify Google OAuth provider is enabled in Supabase
- Check that Site URL is set correctly

### **Issue: "Session not persisting"**
**Cause:** Cookie domain mismatch
**Solution:**
- Clear browser cookies
- Ensure NEXT_PUBLIC_APP_URL matches the domain you're using
- Check that cookies are being set for .matalino.online

## 📋 **Complete Supabase Redirect URL List**

After all updates, your Supabase should have these redirect URLs:

```
✅ https://www.matalino.online/auth/callback
✅ https://matalino.online/auth/callback
✅ https://src-4zx4wrdgp-jay-cadmus-projects-02376606.vercel.app/auth/callback
✅ http://localhost:3000/auth/callback
✅ https://*.vercel.app/auth/callback (optional - for preview deployments)
```

**Site URL:**
```
https://www.matalino.online
```

## 🎯 **Verification Checklist**

After updating Supabase:

- [ ] All redirect URLs added in Supabase
- [ ] Site URL updated to https://www.matalino.online
- [ ] Google OAuth provider enabled
- [ ] Changes saved in Supabase dashboard
- [ ] Waited 1-2 minutes for propagation
- [ ] Tested Google login - works
- [ ] Tested email/password login - works
- [ ] No console errors in browser
- [ ] Session persists after page refresh
- [ ] Sign out works correctly

## 🔗 **Quick Links**

- **Supabase URL Configuration**: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/url-configuration
- **Supabase Auth Providers**: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/auth/providers
- **Supabase Settings**: https://supabase.com/dashboard/project/hpnmahfdjapnlnhhiqpf/settings/general

---

**✅ Once these Supabase settings are updated, your login flow will work perfectly on your custom domain!**

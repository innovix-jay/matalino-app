# ✅ SSL Certificate Fix Checklist for matalino.online

## 📋 Pre-Fix Diagnosis

- [x] Issue identified: SSL certificate expired
- [x] Root cause: DNS pointing to wrong IPs (216.198.79.1, 216.24.57.1)
- [x] Solution: Update DNS to point to Vercel (76.76.21.21)

---

## 🔧 Fix Steps

### Step 1: Update DNS Records
- [ ] Logged into domain registrar (GoDaddy/Namecheap/Cloudflare/etc.)
- [ ] Found DNS Management section
- [ ] Located A record(s) for matalino.online or @
- [ ] Deleted old A records pointing to 216.198.79.1 and 216.24.57.1
- [ ] Added new A record:
  - Type: A
  - Host: @ (or blank)
  - Value: 76.76.21.21
  - TTL: 3600 or Auto
- [ ] Saved/Applied changes
- [ ] Noted time of DNS update: _______________

### Step 2: Verify Vercel Configuration
- [ ] Visited: https://vercel.com/jay-cadmus-projects-02376606/src/settings/domains
- [ ] Confirmed matalino.online is listed in domains
- [ ] Status shows as "Valid" or "Pending" (not "Error")
- [ ] If error: Removed and re-added domain

### Step 3: Wait for DNS Propagation
- [ ] Waited at least 30 minutes after DNS update
- [ ] Checked DNS propagation: https://dnschecker.org/#A/matalino.online
- [ ] Most locations show 76.76.21.21 (green checkmarks)
- [ ] DNS propagation complete: _______________

### Step 4: Verify SSL Certificate
- [ ] Waited 5-15 minutes after DNS propagation
- [ ] Vercel domain status shows "Valid" with green checkmark
- [ ] SSL certificate automatically provisioned

---

## 🧪 Testing Steps

### Test 1: Homepage Access
- [ ] Visited: https://matalino.online
- [ ] Page loads successfully
- [ ] No security warning
- [ ] Browser shows lock icon (🔒)
- [ ] Clicked lock icon and verified certificate is valid
- [ ] Certificate issued by: Let's Encrypt or Vercel
- [ ] Certificate expiry date is in the future

### Test 2: SSL Certificate Details
- [ ] Clicked lock icon in browser
- [ ] Viewed certificate details
- [ ] Certificate issued to: matalino.online
- [ ] Valid from: (recent date within last few days)
- [ ] Valid until: (should be ~90 days from issue date)
- [ ] No date/time errors

### Test 3: Different Browsers
- [ ] Tested in Chrome/Edge
- [ ] Tested in incognito/private mode
- [ ] Tested in Firefox (if available)
- [ ] Tested on mobile device (if available)
- [ ] All browsers show valid SSL

### Test 4: Authentication Flow
- [ ] Visited: https://matalino.online/auth/login
- [ ] Clicked "Continue with Google"
- [ ] Successfully redirected to Google OAuth
- [ ] After authorization, redirected back to: https://matalino.online/auth/callback
- [ ] Then redirected to: https://matalino.online/dashboard
- [ ] No SSL or redirect errors during flow

### Test 5: Dashboard Access
- [ ] Visited: https://matalino.online/dashboard
- [ ] Dashboard loads successfully
- [ ] User data displays correctly
- [ ] No console errors (F12 → Console tab)
- [ ] All API calls succeed (F12 → Network tab)

### Test 6: Email/Password Login
- [ ] Visited: https://matalino.online/test-auth
- [ ] Used test credentials: jay.cadmus@innovixdynamix.com / Jaychanti78!
- [ ] Login successful
- [ ] Redirects properly
- [ ] Session maintained

---

## 🔍 Verification Commands

### If you have terminal access:

```bash
# Check DNS resolution
nslookup matalino.online
# Expected: 76.76.21.21

# Check SSL certificate
curl -I https://matalino.online
# Expected: HTTP/2 200 (or other 200-level response)
# Should NOT say "certificate expired"

# Detailed SSL check
curl -v https://matalino.online 2>&1 | grep -i "SSL\|certificate"
# Should show valid certificate info
```

---

## ✅ Success Criteria

All of these must be TRUE:

- [x] DNS A record updated to 76.76.21.21
- [ ] DNS propagation complete (checked on dnschecker.org)
- [ ] Vercel domain shows "Valid" status
- [ ] https://matalino.online loads without security warning
- [ ] Browser shows valid SSL certificate (🔒)
- [ ] Certificate is not expired
- [ ] Google OAuth login works
- [ ] Email/password login works
- [ ] Dashboard displays correctly
- [ ] No console errors
- [ ] Works across multiple browsers
- [ ] Works on mobile devices

---

## ⏰ Timeline Tracking

| Step | Started | Completed | Duration |
|------|---------|-----------|----------|
| DNS update | _______ | _______ | _______ |
| DNS propagation | _______ | _______ | ~30-60 min |
| SSL provisioning | _______ | _______ | ~5-15 min |
| Testing | _______ | _______ | ~15 min |
| **Total** | _______ | _______ | ~1-2 hours |

---

## 🚨 Troubleshooting

### Issue: DNS not propagating after 2 hours
- [ ] Verified I updated the correct domain registrar
- [ ] Checked if there's a nameserver setting overriding DNS
- [ ] Contacted domain registrar support

### Issue: Vercel not detecting DNS
- [ ] Waited full 60 minutes for propagation
- [ ] Refreshed Vercel domain page
- [ ] Removed and re-added domain in Vercel
- [ ] Checked Vercel status page: https://www.vercel-status.com

### Issue: Still seeing certificate error
- [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] Tested in incognito/private mode
- [ ] Tested from different network/device
- [ ] Waited additional 30 minutes
- [ ] Verified DNS shows correct IP on dnschecker.org

### Issue: Certificate valid but site not loading
- [ ] Checked Vercel deployment status
- [ ] Verified environment variables are set
- [ ] Checked Vercel logs for errors
- [ ] Redeployed application

---

## 📞 Support Resources

### If still having issues after completing all steps:

**Vercel Support:**
- Dashboard: https://vercel.com/support
- Status: https://www.vercel-status.com
- Twitter: @vercel

**DNS/Domain Issues:**
- Contact your domain registrar support
- Provide: domain name, changes made, time of changes

**Emergency Fallback:**
- Use Vercel URL temporarily: https://src-4zx4wrdgp-jay-cadmus-projects-02376606.vercel.app

---

## 📝 Notes

**Date/Time of fix attempt:** _______________

**Domain registrar used:** _______________

**Issues encountered:**
- _______________
- _______________

**Final status:**
- [ ] ✅ RESOLVED - Site is working perfectly
- [ ] ⏳ IN PROGRESS - Waiting for DNS/SSL
- [ ] ❌ BLOCKED - Need additional help

**Time to resolution:** _______________

---

## 🎉 Post-Fix Tasks

Once SSL is working:

- [ ] Update Supabase redirect URLs (if not done):
  - https://matalino.online/auth/callback
  - https://www.matalino.online/auth/callback

- [ ] Update Vercel environment variables:
  - NEXT_PUBLIC_APP_URL=https://matalino.online

- [ ] Update Google OAuth authorized domains:
  - Add matalino.online

- [ ] Test complete user journey:
  - Signup → Login → Dashboard → Logout

- [ ] Monitor for 24 hours for stability

- [ ] Setup monitoring/alerts (optional):
  - SSL certificate expiry alerts
  - Uptime monitoring

---

## 📊 Final Verification

**Before closing this checklist:**

- [ ] Tested site from 3+ different locations/devices
- [ ] All team members can access without SSL errors
- [ ] No console errors or warnings
- [ ] All features working (auth, dashboard, etc.)
- [ ] SSL certificate valid for 90 days
- [ ] Site performance is good (<3s load time)

**Date/Time fix confirmed working:** _______________

---

## 🎯 Summary

**Problem:** SSL certificate expired due to DNS pointing to wrong IPs

**Solution:** Updated DNS A record to point to Vercel (76.76.21.21)

**Result:** Vercel auto-provisioned valid SSL certificate

**Status:** 
- [ ] ✅ COMPLETE - All tests passing
- [ ] ⏳ PENDING - Waiting for DNS/SSL
- [ ] ❌ FAILED - Need additional support

---

**🎉 Once all checkboxes are checked, your SSL certificate issue is resolved!**

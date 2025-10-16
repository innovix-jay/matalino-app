# Production Deployment Checklist

Use this checklist to ensure your Matalino app is production-ready.

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] TypeScript builds without errors (`npm run build`)
- [x] No console errors in development
- [x] All environment variables documented
- [x] Error handling implemented
- [x] Rate limiting configured
- [x] Security headers set in `next.config.js`

### ✅ Database (Supabase)
- [ ] Production project created
- [ ] Database migrations applied
- [ ] RLS policies enabled and tested
- [ ] Storage buckets configured (if using file uploads)
- [ ] Database backups enabled
- [ ] Google OAuth provider configured

### ✅ Authentication
- [ ] Google OAuth credentials (production)
- [ ] Redirect URLs configured in Supabase
- [ ] Test login/signup flow
- [ ] Password reset works (if using email auth)

### ✅ Payments (Stripe)
- [ ] Test mode working locally
- [ ] Decide: Test mode or Live mode for deployment
- [ ] Webhook endpoint configured
- [ ] Webhook secret set in environment
- [ ] Test checkout flow end-to-end
- [ ] Payment confirmation emails (if implemented)

### ✅ Environment Variables
- [ ] All REQUIRED vars set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` updated with production URL
- [ ] Stripe keys match mode (test/live)
- [ ] Supabase keys are production keys
- [ ] `NEXTAUTH_SECRET` generated and set

### ✅ Performance
- [ ] Images optimized
- [ ] Database queries indexed
- [ ] Caching strategy considered
- [ ] Bundle size acceptable (`npm run build` output)

### ✅ Security
- [ ] Rate limiting active on sensitive endpoints
- [ ] CORS configured correctly
- [ ] Security headers enabled
- [ ] No sensitive data in logs
- [ ] API keys not committed to repo

---

## 🚀 Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "chore: production-ready configuration"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Import `innovix-jay/matalino-app`
3. Configure project:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
4. Add environment variables (see VERCEL_ENV_VARS.md)
5. Click **Deploy**

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Post-Deployment Configuration

**A. Update Supabase Redirect URLs**
1. Copy your Vercel URL: `https://matalino-app-xxx.vercel.app`
2. Go to Supabase Dashboard → Authentication → URL Configuration
3. Add to **Redirect URLs**:
   ```
   https://matalino-app-xxx.vercel.app/auth/callback
   https://matalino-app-xxx.vercel.app
   ```
4. Set **Site URL**: `https://matalino-app-xxx.vercel.app`

**B. Update Environment Variables**
1. In Vercel, update `NEXT_PUBLIC_APP_URL` to your actual URL
2. Go to Deployments → ⋯ → Redeploy

**C. Configure Stripe Webhook**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://matalino-app-xxx.vercel.app/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy **Signing secret** (starts with `whsec_`)
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`
7. Redeploy

---

## 🧪 Post-Deployment Testing

### Critical User Flows

**1. Authentication**
- [ ] Sign up with Google OAuth
- [ ] Log out and log back in
- [ ] Access dashboard after login
- [ ] Verify protected routes redirect to login

**2. Products**
- [ ] Create a new product
- [ ] Edit product details
- [ ] Delete product
- [ ] View product on storefront

**3. Payments**
- [ ] Click "Buy Now" on product
- [ ] Complete Stripe checkout (use test card: 4242 4242 4242 4242)
- [ ] Verify redirect back to app
- [ ] Check Stripe dashboard for payment
- [ ] Verify webhook received (check Stripe logs)

**4. Email Subscribers**
- [ ] Add new subscriber
- [ ] View subscribers list
- [ ] Delete subscriber

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] No console errors in browser
- [ ] Images load properly
- [ ] Mobile responsive design works

### Security Testing
- [ ] Try accessing `/dashboard` without login → redirected
- [ ] Try accessing another user's data → blocked by RLS
- [ ] Rate limiting works (make 11 requests quickly)
- [ ] HTTPS enforced (no mixed content warnings)

---

## 🔧 Monitoring & Maintenance

### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Review Stripe payment logs
- [ ] Check Supabase database health

### Weekly Checks
- [ ] Review error logs (once monitoring is set up)
- [ ] Check database size and optimize if needed
- [ ] Verify backups are working

### Monthly Checks
- [ ] Update dependencies (`npm outdated`)
- [ ] Security audit (`npm audit`)
- [ ] Review and optimize slow database queries
- [ ] Check Stripe/Supabase usage and billing

---

## 🆘 Troubleshooting

### Build Fails on Vercel
1. Check build logs for specific error
2. Run `npm run build` locally to reproduce
3. Ensure all dependencies in `package.json`
4. Verify TypeScript types are correct

### Authentication Not Working
1. Check Supabase redirect URLs match Vercel domain exactly
2. Verify `NEXT_PUBLIC_APP_URL` is correct
3. Check browser console for errors
4. Ensure cookies are enabled
5. Try clearing browser cache

### Stripe Checkout Fails
1. Verify Stripe keys are correct (test/live)
2. Check product has valid price > 0
3. Look at browser network tab for API errors
4. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

### Webhooks Not Receiving Events
1. Check Stripe webhook URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` is set in Vercel
3. Look at Stripe webhook logs for delivery attempts
4. Check Vercel function logs

### Database Errors
1. Verify RLS policies allow the operation
2. Check user is authenticated
3. Look at Supabase logs
4. Ensure migrations are applied

---

## 📈 Going to Production (Live Payments)

When you're ready to accept real payments:

### 1. Complete Stripe Onboarding
- [ ] Verify business details
- [ ] Add bank account for payouts
- [ ] Set up tax collection (if applicable)
- [ ] Review terms and compliance

### 2. Switch to Live Mode
- [ ] Get Live API keys from Stripe
- [ ] Update Vercel env vars with live keys
- [ ] Create new webhook in Live mode
- [ ] Test with real credit card (small amount)
- [ ] Refund test transaction

### 3. Legal & Compliance
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Refund Policy documented
- [ ] GDPR compliance (if EU customers)
- [ ] Cookie consent (if needed)

### 4. Marketing Launch
- [ ] Announce to audience
- [ ] Monitor first transactions closely
- [ ] Have support channel ready
- [ ] Create documentation/FAQs

---

## 🎉 Production Launch Day

### Morning Of
- [ ] Verify site is live and accessible
- [ ] Test complete user journey one more time
- [ ] Set up monitoring alerts
- [ ] Announce launch

### During Launch
- [ ] Monitor error logs in real-time
- [ ] Watch Stripe dashboard for payments
- [ ] Respond to user issues quickly
- [ ] Track conversion rates

### End of Day
- [ ] Review all transactions
- [ ] Check for any errors or issues
- [ ] Respond to support requests
- [ ] Celebrate! 🎊

---

## 📞 Support Resources

- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Next.js**: https://nextjs.org/docs

Good luck with your launch! 🚀


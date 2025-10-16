# Stripe Setup Guide for Matalino

## Quick Start

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Click "Start now" and create an account
3. Complete the onboarding (you can skip most steps for testing)

### 2. Get Test API Keys
1. Make sure you're in **Test Mode** (toggle in top-right corner)
2. Go to **Developers** → **API Keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_` - click "Reveal test key")

### 3. Add Keys to Your Project

Update your `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx
```

### 4. Restart Your Server

```bash
# Stop the current server (Ctrl+C in terminal)
npm run dev
```

### 5. Test It Out

1. Go to http://localhost:3000/dashboard
2. Click **Products** → **Add Product**
3. Create a test product:
   - Name: "Test Digital Product"
   - Price: 9.99
   - Type: Digital
   - Status: Active
4. Visit the product page (copy the ID from the products list)
5. Go to: http://localhost:3000/store/[paste-product-id-here]
6. Click **"Buy Now"**

You should be redirected to Stripe Checkout!

### 6. Complete Test Purchase

Use these test card details:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

After completing the purchase, you'll be redirected back to your app.

---

## How the Integration Works

### Product Purchase Flow

1. **User clicks "Buy Now"** on product page
2. **Your app calls** `/api/checkout` endpoint
3. **Stripe creates** a Checkout Session
4. **User is redirected** to Stripe-hosted checkout
5. **User completes payment** on Stripe
6. **Stripe redirects** back to success page
7. **(Optional) Webhook** records order in database

### Files Involved

- `app/api/checkout/route.ts` - Creates Stripe checkout session
- `app/store/[id]/page.tsx` - Product storefront with "Buy Now" button
- `app/dashboard/products/page.tsx` - Product management UI

---

## Testing Cards

Stripe provides test cards for different scenarios:

| Card Number          | Scenario                    |
|---------------------|-----------------------------|
| 4242 4242 4242 4242 | ✅ Success                  |
| 4000 0000 0000 9995 | ❌ Declined (insufficient)  |
| 4000 0025 0000 3155 | 🔐 Requires authentication  |

All cards use:
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any valid ZIP code

---

## View Test Payments

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. You'll see all test payments
3. Click on a payment to see details

---

## Production Mode

### When You're Ready to Go Live

1. Switch to **Live Mode** in Stripe Dashboard
2. Complete business verification
3. Get **Live API Keys**:
   - `pk_live_xxxxx` (publishable)
   - `sk_live_xxxxx` (secret)
4. Update Vercel environment variables with live keys
5. Redeploy your app

---

## Optional: Add Webhooks

Webhooks let Stripe notify your app when payments succeed, so you can:
- Record orders in your database
- Send confirmation emails
- Deliver digital products automatically

### Setup Webhook (Local Testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Setup Webhook (Production)

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. URL: `https://your-vercel-app.vercel.app/api/webhooks/stripe`
4. Events: Select `checkout.session.completed`
5. Copy the signing secret
6. Add to Vercel environment variables

---

## Troubleshooting

### "Stripe is not defined"
- Make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Restart your dev server after adding env vars

### "Invalid API Key"
- Double-check your secret key starts with `sk_test_`
- Make sure there are no extra spaces in `.env.local`

### Checkout not loading
- Check browser console for errors
- Verify product has a price > 0
- Make sure you're using test mode keys

### Redirect after payment doesn't work
- Update `NEXT_PUBLIC_APP_URL` in `.env.local`
- Should be `http://localhost:3000` for local dev

---

## Next Steps

Once Stripe is working locally:

1. ✅ Create a few test products
2. ✅ Test purchases with test cards
3. ✅ Push code to GitHub
4. ✅ Deploy to Vercel
5. ⚠️  Add production Stripe keys to Vercel
6. ⚠️  Test live checkout on Vercel URL

Need help? Check the [Stripe Docs](https://stripe.com/docs) or ask in the chat!


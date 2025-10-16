import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }
  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-04-10' })

  const url = new URL(req.url)
  const productId = url.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('id', productId)
    .single()
  if (error || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(Number(product.price) * 100),
          product_data: { name: product.name },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/store/${product.id}`,
  })

  return NextResponse.redirect(session.url!, { status: 303 })
}




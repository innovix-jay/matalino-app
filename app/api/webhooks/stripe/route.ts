import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get supabase client
        const supabase = await createClient()

        // Record the order in database
        const { error } = await supabase.from('orders').insert({
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          customer_email: session.customer_details?.email,
          amount_total: session.amount_total,
          currency: session.currency,
          status: 'completed',
          metadata: session.metadata,
        })

        if (error) {
          console.error('Error recording order:', error)
        } else {
          console.log('✅ Order recorded:', session.id)
        }

        // TODO: Send confirmation email
        // TODO: Deliver digital product if applicable

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        
        // TODO: Send payment failed notification
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}


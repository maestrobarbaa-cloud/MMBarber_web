import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret');
      return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const mmcoinsCount = parseInt(session.metadata?.mmcoinsCount || '0', 10);

      if (userId && mmcoinsCount > 0) {
        // Zapsání MMCoinů do databáze
        await prisma.user.update({
          where: { id: userId },
          data: {
            mmcoins: {
              increment: mmcoinsCount,
            },
          },
        });
        
        console.log(`Successfully added ${mmcoinsCount} MMCOINs to user ${userId}`);
      } else {
        console.error('Missing userId or mmcoinsCount in metadata', session.metadata);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

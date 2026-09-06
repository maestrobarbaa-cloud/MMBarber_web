import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Otestujeme status session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status === 'paid') {
      const userId = checkoutSession.metadata?.userId;
      const mmcoinsCount = parseInt(checkoutSession.metadata?.mmcoinsCount || '0', 10);
      const processed = checkoutSession.metadata?.processed === 'true';

      if (userId && mmcoinsCount > 0 && !processed) {
        // Označíme jako processed na straně Stripe
        await stripe.checkout.sessions.update(sessionId, {
          metadata: {
            ...checkoutSession.metadata,
            processed: 'true'
          }
        });

        // Zapíšeme mince do databáze
        await prisma.user.update({
          where: { id: userId },
          data: {
            mmcoins: {
              increment: mmcoinsCount,
            },
          },
        });

        return NextResponse.json({ success: true, message: `Added ${mmcoinsCount} MMCOINs` });
      } else if (processed) {
        return NextResponse.json({ success: true, message: 'Already processed', amount: mmcoinsCount });
      } else {
        return NextResponse.json({ error: 'Invalid user or metadata' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
  } catch (error) {
    console.error('Stripe Verify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

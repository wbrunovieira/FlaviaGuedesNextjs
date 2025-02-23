// src/app/api/save-payment/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion:
      '2022-11-15' as unknown as '2025-01-27.acacia',
  }
);

export async function POST(req: Request) {
  try {
    const { sessionId, cancelled } = (await req.json()) as {
      sessionId: string;
      cancelled?: boolean;
    };

    if (cancelled) {
      await prisma.giftCard.update({
        where: { stripeSessionId: sessionId },
        data: { cancelled: true },
      });
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ['payment_intent'],
      }
    );

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    if (!session.payment_intent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent.id;

    await prisma.giftCard.update({
      where: { stripeSessionId: session.id },
      data: { stripePaymentId: paymentIntentId },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error';
    console.error('Error saving payment:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

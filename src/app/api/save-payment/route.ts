// src/app/api/save-payment/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  db,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from './../../../../firebase-config';

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

    const findGiftCardDoc = async (
      stripeSessionId: string
    ) => {
      const giftCardsRef = collection(db, 'giftCards');
      const q = query(
        giftCardsRef,
        where('stripeSessionId', '==', stripeSessionId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      return querySnapshot.docs[0].ref;
    };

    if (cancelled) {
      const giftCardRef = await findGiftCardDoc(sessionId);
      if (!giftCardRef) {
        return NextResponse.json(
          { error: 'Gift card not found for cancellation' },
          { status: 404 }
        );
      }
      await updateDoc(giftCardRef, { cancelled: true });
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ['payment_intent'] }
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

    const giftCardRef = await findGiftCardDoc(session.id);
    if (!giftCardRef) {
      return NextResponse.json(
        { error: 'Gift card not found for payment update' },
        { status: 404 }
      );
    }

    await updateDoc(giftCardRef, {
      stripePaymentId: paymentIntentId,
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

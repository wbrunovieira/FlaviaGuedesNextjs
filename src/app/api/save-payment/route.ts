import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  db,
  doc,
  updateDoc,
} from './../../../../firebase-config'; // Importando Firestore

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

    // Verificando se a compra foi cancelada
    if (cancelled) {
      const giftCardRef = doc(db, 'giftCards', sessionId); // Referência para o documento
      await updateDoc(giftCardRef, { cancelled: true }); // Atualizando o status
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // Recuperando a sessão de pagamento do Stripe
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ['payment_intent'] }
    );

    // Verificando se o pagamento foi concluído
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

    // Pegando o ID do Payment Intent
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent.id;

    // Atualizando o Firestore com o ID do pagamento
    const giftCardRef = doc(db, 'giftCards', session.id); // Referência para o documento
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

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  db,
  collection,
  addDoc,
} from './../../../../firebase-config'; // Importando Firebase

// Inicializando Stripe
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion:
      '2022-11-15' as unknown as '2025-01-27.acacia',
  }
);

export async function POST(req: Request) {
  console.log(
    '[DEBUG] POST request received for create-checkout-session.'
  );
  try {
    const body = await req.json();
    console.log('[DEBUG] Request body:', body);

    const { amount, locale, name, phone, message } =
      body as {
        amount: number;
        locale: string;
        name: string;
        phone?: string;
        message?: string;
      };

    const origin =
      req.headers.get('origin') ||
      process.env.BASE_URL ||
      'http://localhost:3000';
    console.log('[DEBUG] Resolved origin:', origin);

    console.log(
      '[DEBUG] Creating Stripe checkout session with:'
    );
    console.log('        - Amount (in cents):', amount);
    console.log('        - Locale:', locale);
    console.log('        - Name:', name);
    console.log('        - Phone:', phone);
    console.log('        - Message:', message);

    // Criar a sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Gift Card' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cancel`,
      metadata: {
        name,
        phone: phone || '',
        message: message || '',
      },
    });

    console.log(
      '[DEBUG] Stripe session created with ID:',
      session.id
    );

    // Salvar o gift card no Firestore
    const giftCardData = {
      amount,
      name,
      phone: phone || null,
      message: message || null,
      stripeSessionId: session.id,
      stripePaymentId: '',
      cancelled: false, // Se desejar, você pode adicionar o campo "cancelled" como padrão
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Criar a coleção "giftCards" e adicionar o documento
    const docRef = await addDoc(
      collection(db, 'giftCards'),
      giftCardData
    );
    console.log(
      '[DEBUG] GiftCard record created in Firestore with ID:',
      docRef.id
    );

    return NextResponse.json(
      { sessionId: session.id },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error';
    console.error(
      '[ERROR] Erro ao criar a sessão do Stripe:',
      errorMessage
    );
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

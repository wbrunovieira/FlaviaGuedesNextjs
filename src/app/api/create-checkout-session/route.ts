// src/app/api/create-checkout-session/route.ts
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
    const body = await req.json();
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

    // Cria a sessão do Stripe e inclui os metadados
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

    // Registra no banco um registro preliminar do gift card
    await prisma.giftCard.create({
      data: {
        amount,
        name,
        phone: phone || null,
        message: message || null,
        stripeSessionId: session.id,
        stripePaymentId: '', // ficará vazio até o pagamento ser confirmado
      },
    });

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
      'Erro ao criar a sessão do Stripe:',
      errorMessage
    );
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

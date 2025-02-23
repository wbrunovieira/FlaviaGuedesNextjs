// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: '2022-11-15' as any,
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, locale } = body as {
      amount: number;
      locale: string;
    };

    const origin =
      req.headers.get('origin') || 'http://localhost:3000';

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
    });

    return NextResponse.json(
      { sessionId: session.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      'Erro ao criar a sessão do Stripe:',
      error
    );
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

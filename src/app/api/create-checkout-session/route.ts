import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: '2025-01-27.acacia', // verifique a versão recomendada
  }
);

export async function POST(request: Request) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gift Card',
              description: 'Gift card for a special treat',
            },
            unit_amount: 5000, // valor em centavos (5000 = $50.00)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get(
        'origin'
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

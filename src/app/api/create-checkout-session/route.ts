// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

// Global type declaration for PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Função que modifica a URL de conexão para desabilitar prepared statements
function getConnectionUrl() {
  const url = process.env.POSTGRES_URL || '';
  // Se a URL já contém pg_disable_prepared_statements, retorne a URL original
  if (url.includes('pg_disable_prepared_statements=true')) {
    return url;
  }
  // Adicione o parâmetro para desabilitar prepared statements
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}pg_disable_prepared_statements=true&sslmode=no-verify&connection_limit=1&pool_timeout=0`;
}

// Create a Prisma client with the correct configuration for serverless environments
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getConnectionUrl(),
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });
};

// Use global object for development to prevent multiple instances
const prisma = global.prisma || prismaClientSingleton();
if (process.env.NODE_ENV !== 'production')
  global.prisma = prisma;

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

    // Create a gift card record in the database
    const giftCardRecord = await prisma.giftCard.create({
      data: {
        amount,
        name,
        phone: phone || null,
        message: message || null,
        stripeSessionId: session.id,
        stripePaymentId: '',
      },
    });

    console.log(
      '[DEBUG] GiftCard record created in database:',
      giftCardRecord
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

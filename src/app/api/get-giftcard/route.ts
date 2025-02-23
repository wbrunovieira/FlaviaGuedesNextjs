// src/app/api/get-giftcard/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing sessionId' },
      { status: 400 }
    );
  }

  try {
    const giftCard = await prisma.giftCard.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sessionId: giftCard.stripeSessionId,
      name: giftCard.name,
      phone: giftCard.phone,
      message: giftCard.message,
      amount: giftCard.amount, // cents
      stripePaymentId: giftCard.stripePaymentId,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error';
    console.error(
      'Error retrieving gift card:',
      errorMessage
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

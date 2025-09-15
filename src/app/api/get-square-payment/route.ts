// src/app/api/get-square-payment/route.ts
import { NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import {
  db,
  doc,
  getDoc,
} from './../../../../firebase-config';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

const client = new SquareClient({
  accessToken: isProduction
    ? process.env.SQUARE_ACCESS_TOKEN!
    : process.env.SQUARE_SANDBOX_ACCESS_TOKEN!,
  environment: isProduction
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
  squareVersion: '2025-08-20'
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json(
      { error: 'Missing paymentId' },
      { status: 400 }
    );
  }

  try {
    // Get from Firebase
    const giftCardRef = doc(db, 'giftCards', paymentId);
    const giftCardSnap = await getDoc(giftCardRef);

    if (!giftCardSnap.exists()) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    const giftCard = giftCardSnap.data();

    // Also get latest payment status from Square
    try {
      const paymentResponse = await client.payments.retrieve(paymentId);
      if (paymentResponse.payment) {
        giftCard.paymentStatus = paymentResponse.payment.status;
        giftCard.receiptUrl = paymentResponse.payment.receiptUrl;
      }
    } catch (squareError) {
      console.error('Error fetching Square payment:', squareError);
    }

    return NextResponse.json({
      paymentId: giftCard.squarePaymentId,
      name: giftCard.name,
      giftName: giftCard.giftName,
      phone: giftCard.phone,
      message: giftCard.message,
      amount: giftCard.amount,
      receiptUrl: giftCard.squareReceiptUrl,
      status: giftCard.paymentStatus,
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
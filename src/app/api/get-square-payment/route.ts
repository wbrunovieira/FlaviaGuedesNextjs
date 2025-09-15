// src/app/api/get-square-payment/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  doc,
  getDoc,
} from './../../../../firebase-config';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('paymentId');

  console.log('[DEBUG] Get Square Payment - paymentId:', paymentId);

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
      console.error('[ERROR] Gift card not found in Firebase for paymentId:', paymentId);
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    const giftCard = giftCardSnap.data();
    console.log('[DEBUG] Gift card data from Firebase:', giftCard);

    // Skip Square API call for now - using Firebase data
    // TODO: Update when Square SDK is properly configured
    console.log('[INFO] Using Firebase data for payment details');

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
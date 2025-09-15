// src/app/api/create-square-payment/route.ts
import { NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import {
  db,
  setDoc,
  doc,
} from './../../../../firebase-config';

// Determine if we're in production based on NODE_ENV or Vercel environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

// Get the appropriate access token
const accessToken = isProduction
  ? process.env.SQUARE_ACCESS_TOKEN!
  : process.env.SQUARE_SANDBOX_ACCESS_TOKEN!;

console.log('[DEBUG] Using access token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'MISSING');
console.log('[DEBUG] Token length:', accessToken?.length);

// Initialize Square client with appropriate credentials
const client = new SquareClient({
  accessToken,
  environment: isProduction
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
  squareVersion: '2025-08-20'
});

export async function POST(req: Request) {
  console.log('[DEBUG] Square payment request received');
  console.log('[DEBUG] Environment:', isProduction ? 'Production' : 'Sandbox');

  try {
    const body = await req.json();
    const {
      amount,
      locale,
      name,
      giftName,
      phone,
      message,
      sourceId, // This will be the payment token from Square Web Payments SDK
    } = body;

    console.log('[DEBUG] Payment details:', {
      amount,
      locale,
      name,
      giftName,
      sourceId: sourceId ? 'provided' : 'missing'
    });

    // Get location ID - fetch first location if not set
    let locationId = process.env.SQUARE_LOCATION_ID;

    if (!locationId) {
      console.log('[DEBUG] Fetching location ID from Square');
      try {
        const locationsResponse = await client.locations.list();
        if (locationsResponse.locations && locationsResponse.locations.length > 0) {
          locationId = locationsResponse.locations[0].id!;
          console.log('[DEBUG] Using location ID:', locationId);
        } else {
          // Use default location for sandbox
          locationId = 'L1'; // Default sandbox location
          console.log('[DEBUG] Using default sandbox location ID:', locationId);
        }
      } catch (locError) {
        console.error('[ERROR] Failed to fetch locations:', locError);
        // Use default location for sandbox
        locationId = 'L1'; // Default sandbox location
        console.log('[DEBUG] Using fallback location ID:', locationId);
      }
    }

    // Create unique idempotency key
    const idempotencyKey = `gift-card-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment with Square
    console.log('[DEBUG] Creating Square payment');
    const paymentResponse = await client.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      },
      locationId,
      note: `Gift Card - ${name}${giftName ? ` for ${giftName}` : ''}`,
      referenceId: idempotencyKey,
    });

    if (!paymentResponse.payment) {
      throw new Error('Payment creation failed');
    }

    const payment = paymentResponse.payment;
    console.log('[DEBUG] Square payment created:', payment.id);

    // Save to Firebase
    const giftCardData = {
      amount,
      name,
      giftName,
      phone: phone || null,
      message: message || null,
      squarePaymentId: payment.id,
      squareOrderId: payment.orderId || null,
      squareReceiptUrl: payment.receiptUrl || null,
      paymentStatus: payment.status,
      cancelled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(
      doc(db, 'giftCards', payment.id!),
      giftCardData
    );
    console.log('[DEBUG] Gift card saved to Firebase');

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl,
      status: payment.status,
      giftCardData
    }, { status: 200 });

  } catch (error: any) {
    console.error('[ERROR] Square payment error:', error);
    console.error('[ERROR] Error stack:', error.stack);
    console.error('[ERROR] Error details:', JSON.stringify(error, null, 2));

    // Handle Square-specific errors
    if (error.errors) {
      const squareErrors = error.errors.map((e: any) => ({
        code: e.code,
        detail: e.detail,
        field: e.field
      }));
      return NextResponse.json(
        {
          error: 'Square payment failed',
          details: squareErrors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        debug: {
          name: error.name,
          message: error.message,
          hasToken: !!process.env.SQUARE_SANDBOX_ACCESS_TOKEN
        }
      },
      { status: 500 }
    );
  }
}
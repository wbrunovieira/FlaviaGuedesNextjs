// src/app/api/create-square-payment-direct/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  setDoc,
  doc,
} from './../../../../firebase-config';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const {
      amount,
      name,
      giftName,
      phone,
      message,
      sourceId,
    } = body;

    // Get the appropriate access token
    const accessToken = isProduction
      ? process.env.SQUARE_ACCESS_TOKEN!
      : process.env.SQUARE_SANDBOX_ACCESS_TOKEN!;

    const baseUrl = isProduction
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    // First, get location ID
    let locationId = process.env.SQUARE_LOCATION_ID;

    if (!locationId) {

      const locationsResponse = await fetch(`${baseUrl}/v2/locations`, {
        method: 'GET',
        headers: {
          'Square-Version': '2025-08-20',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();

        if (locationsData.locations && locationsData.locations.length > 0) {
          // Inactive locations reject payments, so prefer an ACTIVE one
          const activeLocation =
            locationsData.locations.find(
              (loc: { status?: string }) => loc.status === 'ACTIVE'
            ) ?? locationsData.locations[0];
          locationId = activeLocation.id;
        }
      } else {
        const errorData = await locationsResponse.json();
        console.error('[ERROR] Failed to fetch locations:', errorData);
        // Use default sandbox location
        locationId = 'L1';
      }
    }

    // Create unique idempotency key
    const idempotencyKey = `gift-card-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment request body
    const paymentRequest = {
      source_id: sourceId,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amount,
        currency: 'USD'
      },
      location_id: locationId,
      note: `Gift Card - ${name}${giftName ? ` for ${giftName}` : ''}`,
      reference_id: idempotencyKey,
      autocomplete: true
    };

    // Create payment
    const paymentResponse = await fetch(`${baseUrl}/v2/payments`, {
      method: 'POST',
      headers: {
        'Square-Version': '2025-08-20',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(JSON.stringify(paymentData));
    }

    const payment = paymentData.payment;

    // Save to Firebase
    const giftCardData = {
      amount,
      name,
      giftName,
      phone: phone || null,
      message: message || null,
      squarePaymentId: payment.id,
      squareOrderId: payment.order_id || null,
      squareReceiptUrl: payment.receipt_url || null,
      paymentStatus: payment.status,
      paid: payment.status === 'COMPLETED', // Add paid boolean field
      cancelled: false,
      // Payment method details
      paymentMethod: payment.source_type || 'UNKNOWN',
      cardBrand: payment.card_details?.card?.card_brand || null,
      cardLast4: payment.card_details?.card?.last_4 || null,
      cardType: payment.card_details?.card?.card_type || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(
      doc(db, 'giftCards', payment.id),
      giftCardData
    );

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      receiptUrl: payment.receipt_url,
      status: payment.status,
      giftCardData
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('[ERROR] Square payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ERROR] Error message:', errorMessage);

    let errorDetails;
    try {
      errorDetails = JSON.parse(errorMessage);
    } catch {
      errorDetails = { error: errorMessage };
    }

    return NextResponse.json(
      {
        error: 'Payment failed',
        details: errorDetails,
      },
      { status: 400 }
    );
  }
}
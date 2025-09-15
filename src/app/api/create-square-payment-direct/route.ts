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
  console.log('[DEBUG] Square payment request received (Direct API)');
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
      sourceId,
    } = body;

    console.log('[DEBUG] Payment details:', {
      amount,
      locale,
      name,
      giftName,
      sourceId: sourceId ? 'provided' : 'missing'
    });

    // Get the appropriate access token
    const accessToken = isProduction
      ? process.env.SQUARE_ACCESS_TOKEN!
      : process.env.SQUARE_SANDBOX_ACCESS_TOKEN!;

    const baseUrl = isProduction
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    console.log('[DEBUG] Using access token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'MISSING');
    console.log('[DEBUG] Base URL:', baseUrl);

    // First, get location ID
    let locationId = process.env.SQUARE_LOCATION_ID;

    if (!locationId) {
      console.log('[DEBUG] Fetching locations from Square API directly');

      const locationsResponse = await fetch(`${baseUrl}/v2/locations`, {
        method: 'GET',
        headers: {
          'Square-Version': '2025-08-20',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[DEBUG] Locations response status:', locationsResponse.status);

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        console.log('[DEBUG] Locations data:', JSON.stringify(locationsData, null, 2));

        if (locationsData.locations && locationsData.locations.length > 0) {
          locationId = locationsData.locations[0].id;
          console.log('[DEBUG] Using location ID:', locationId);
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

    console.log('[DEBUG] Payment request:', JSON.stringify(paymentRequest, null, 2));

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

    console.log('[DEBUG] Payment response status:', paymentResponse.status);

    const paymentData = await paymentResponse.json();
    console.log('[DEBUG] Payment response data:', JSON.stringify(paymentData, null, 2));

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
    console.log('[DEBUG] Gift card saved to Firebase');

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
        debug: {
          hasToken: !!process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
          tokenLength: process.env.SQUARE_SANDBOX_ACCESS_TOKEN?.length
        }
      },
      { status: 400 }
    );
  }
}
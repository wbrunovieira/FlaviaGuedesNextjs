// src/app/api/create-beauty-bank/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  setDoc,
  doc,
} from './../../../../firebase-config';
import { getTier } from '@/lib/beauty-bank-tiers';

const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tier, name, phone, email, sourceId } = body;

    const selectedTier = getTier(String(tier));
    if (!selectedTier) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      );
    }
    if (!name || !sourceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const accessToken = isProduction
      ? process.env.SQUARE_ACCESS_TOKEN!
      : process.env.SQUARE_SANDBOX_ACCESS_TOKEN!;
    const baseUrl = isProduction
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    // Resolve an active location
    let locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      const locationsResponse = await fetch(
        `${baseUrl}/v2/locations`,
        {
          method: 'GET',
          headers: {
            'Square-Version': '2025-08-20',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        if (locationsData.locations?.length > 0) {
          const active =
            locationsData.locations.find(
              (loc: { status?: string }) =>
                loc.status === 'ACTIVE'
            ) ?? locationsData.locations[0];
          locationId = active.id;
        }
      }
    }

    const idempotencyKey = `beauty-bank-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    // Charge the deposit amount (not the credit)
    const paymentResponse = await fetch(
      `${baseUrl}/v2/payments`,
      {
        method: 'POST',
        headers: {
          'Square-Version': '2025-08-20',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_id: sourceId,
          idempotency_key: idempotencyKey,
          amount_money: {
            amount: selectedTier.deposit,
            currency: 'USD',
          },
          location_id: locationId,
          note: `VIP Beauty Bank - ${name} ($${selectedTier.deposit / 100} → $${selectedTier.credit / 100} credit)`,
          reference_id: idempotencyKey,
          autocomplete: true,
        }),
      }
    );

    const paymentData = await paymentResponse.json();
    if (!paymentResponse.ok) {
      throw new Error(JSON.stringify(paymentData));
    }

    const payment = paymentData.payment;

    const accountData = {
      name,
      phone: phone || null,
      email: email || null,
      deposit: selectedTier.deposit,
      credit: selectedTier.credit,
      balance: selectedTier.credit,
      transactions: [],
      squarePaymentId: payment.id,
      squareReceiptUrl: payment.receipt_url || null,
      paymentStatus: payment.status,
      paid: payment.status === 'COMPLETED',
      cardBrand: payment.card_details?.card?.card_brand || null,
      cardLast4: payment.card_details?.card?.last_4 || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(
      doc(db, 'beautyBank', payment.id),
      accountData
    );

    return NextResponse.json(
      {
        success: true,
        accountId: payment.id,
        credit: selectedTier.credit,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('[ERROR] Beauty Bank payment error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    let errorDetails;
    try {
      errorDetails = JSON.parse(errorMessage);
    } catch {
      errorDetails = { error: errorMessage };
    }
    return NextResponse.json(
      { error: 'Payment failed', details: errorDetails },
      { status: 400 }
    );
  }
}

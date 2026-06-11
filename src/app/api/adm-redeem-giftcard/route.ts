// src/app/api/adm-redeem-giftcard/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  doc,
  getDoc,
  updateDoc,
} from './../../../../firebase-config';

export async function POST(req: Request) {
  try {
    const { id, redeemedAt, undo } = (await req.json()) as {
      id?: string;
      redeemedAt?: string;
      undo?: boolean;
    };

    if (!id) {
      return NextResponse.json(
        { error: 'Missing gift card id' },
        { status: 400 }
      );
    }

    const giftCardRef = doc(db, 'giftCards', id);
    const snapshot = await getDoc(giftCardRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    if (undo) {
      await updateDoc(giftCardRef, {
        redeemed: false,
        redeemedAt: null,
      });
      return NextResponse.json(
        { success: true, redeemed: false },
        { status: 200 }
      );
    }

    const date = redeemedAt ? new Date(redeemedAt) : new Date();
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date' },
        { status: 400 }
      );
    }

    await updateDoc(giftCardRef, {
      redeemed: true,
      redeemedAt: date.toISOString(),
    });

    return NextResponse.json(
      { success: true, redeemed: true, redeemedAt: date.toISOString() },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      '[ERROR] Failed to update gift card redemption:',
      errorMessage
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

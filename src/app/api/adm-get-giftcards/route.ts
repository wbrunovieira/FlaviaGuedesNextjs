// src/app/api/admin-get-giftcards/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  collection,
  getDocs,
} from './../../../../firebase-config';

export async function GET() {
  try {
    const giftCardsRef = collection(db, 'giftCards');
    const querySnapshot = await getDocs(giftCardsRef);

    const giftCards = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(giftCards, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error';
    console.error(
      '[ERROR] Failed to fetch gift cards:',
      errorMessage
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

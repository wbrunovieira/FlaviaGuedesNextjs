// src/app/api/adm-delete-giftcard/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  doc,
  getDoc,
  deleteDoc,
} from './../../../../firebase-config';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

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

    await deleteDoc(giftCardRef);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error';
    console.error(
      '[ERROR] Failed to delete gift card:',
      errorMessage
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

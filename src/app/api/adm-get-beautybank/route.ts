// src/app/api/adm-get-beautybank/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  collection,
  getDocs,
} from './../../../../firebase-config';

export async function GET() {
  try {
    const ref = collection(db, 'beautyBank');
    const snapshot = await getDocs(ref);
    const accounts = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt:
          data.createdAt?.toDate().toISOString() || null,
      };
    });
    return NextResponse.json(accounts, { status: 200 });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      '[ERROR] Failed to fetch beauty bank accounts:',
      msg
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

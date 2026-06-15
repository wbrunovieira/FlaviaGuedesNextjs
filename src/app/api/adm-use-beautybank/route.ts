// src/app/api/adm-use-beautybank/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  doc,
  runTransaction,
} from './../../../../firebase-config';
import {
  applyDeduction,
  applyUndo,
  type Transaction,
} from '@/lib/beauty-bank';

// Carries an HTTP status out of the Firestore transaction callback
class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body as {
      id?: string;
      action?: 'add' | 'remove';
    };

    if (!id) {
      return NextResponse.json(
        { error: 'Missing account id' },
        { status: 400 }
      );
    }

    const ref = doc(db, 'beautyBank', id);

    // Atomic read-modify-write: prevents lost updates on concurrent edits
    const newBalance = await runTransaction(
      db,
      async tx => {
        const snap = await tx.get(ref);
        if (!snap.exists()) {
          throw new HttpError(404, 'Account not found');
        }
        const data = snap.data();
        const credit: number = data.credit ?? 0;
        const transactions: Transaction[] =
          data.transactions ?? [];

        if (action === 'remove') {
          const result = applyUndo(
            credit,
            transactions,
            String(body.txId)
          );
          if (!result.ok) {
            throw new HttpError(404, result.error);
          }
          tx.update(ref, {
            transactions: result.transactions,
            balance: result.balance,
            updatedAt: new Date(),
          });
          return result.balance;
        }

        const result = applyDeduction({
          credit,
          transactions,
          amountDollars: Number(body.amount),
          note: body.note,
          date: body.date,
        });
        if (!result.ok) {
          throw new HttpError(400, result.error);
        }
        tx.update(ref, {
          transactions: result.transactions,
          balance: result.balance,
          updatedAt: new Date(),
        });
        return result.balance;
      }
    );

    return NextResponse.json(
      { success: true, balance: newBalance },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    const msg =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      '[ERROR] Failed to update beauty bank usage:',
      msg
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

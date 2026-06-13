// src/app/api/adm-use-beautybank/route.ts
import { NextResponse } from 'next/server';
import {
  db,
  doc,
  getDoc,
  updateDoc,
} from './../../../../firebase-config';

type Transaction = {
  txId: string;
  amount: number; // cents deducted
  note: string | null;
  date: string;
  createdAt: string;
};

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
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    const data = snap.data();
    const balance: number = data.balance ?? 0;
    const transactions: Transaction[] =
      data.transactions ?? [];

    if (action === 'remove') {
      const { txId } = body as { txId?: string };
      const tx = transactions.find(t => t.txId === txId);
      if (!tx) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
      const newTransactions = transactions.filter(
        t => t.txId !== txId
      );
      const newBalance = balance + tx.amount;
      await updateDoc(ref, {
        transactions: newTransactions,
        balance: newBalance,
        updatedAt: new Date(),
      });
      return NextResponse.json(
        { success: true, balance: newBalance },
        { status: 200 }
      );
    }

    // action === 'add'
    const amountDollars = Number(body.amount);
    if (!amountDollars || amountDollars <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }
    const amount = Math.round(amountDollars * 100);
    if (amount > balance) {
      return NextResponse.json(
        { error: 'Amount exceeds remaining balance' },
        { status: 400 }
      );
    }

    const tx: Transaction = {
      txId: `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`,
      amount,
      note: body.note || null,
      date: body.date
        ? new Date(`${body.date}T12:00:00`).toISOString()
        : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const newBalance = balance - amount;
    await updateDoc(ref, {
      transactions: [...transactions, tx],
      balance: newBalance,
      updatedAt: new Date(),
    });
    return NextResponse.json(
      { success: true, balance: newBalance, tx },
      { status: 200 }
    );
  } catch (error: unknown) {
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

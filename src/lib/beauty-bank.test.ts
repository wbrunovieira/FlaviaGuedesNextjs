import { describe, it, expect } from 'vitest';
import {
  dollarsToCents,
  sumTransactions,
  computeBalance,
  applyDeduction,
  applyUndo,
  beautyBankStats,
  type Transaction,
} from './beauty-bank';

const tx = (
  txId: string,
  amount: number,
  note: string | null = null
): Transaction => ({
  txId,
  amount,
  note,
  date: '2026-06-15T12:00:00.000Z',
  createdAt: '2026-06-15T12:00:00.000Z',
});

describe('dollarsToCents', () => {
  it('converts whole dollars', () => {
    expect(dollarsToCents(150)).toBe(15000);
    expect(dollarsToCents(1)).toBe(100);
  });

  it('converts cents without float drift', () => {
    expect(dollarsToCents(0.1)).toBe(10);
    expect(dollarsToCents(0.3)).toBe(30); // 0.3*100 = 30.000000000000004
    expect(dollarsToCents(75.99)).toBe(7599);
    expect(dollarsToCents(150.5)).toBe(15050);
    expect(dollarsToCents(19.9)).toBe(1990);
  });
});

describe('computeBalance', () => {
  it('is credit minus the sum of transactions', () => {
    expect(computeBalance(53000, [])).toBe(53000);
    expect(
      computeBalance(110000, [tx('a', 15000), tx('b', 10000)])
    ).toBe(85000);
  });

  it('sumTransactions handles empty', () => {
    expect(sumTransactions([])).toBe(0);
  });
});

describe('applyDeduction — validation', () => {
  const base = { credit: 53000, transactions: [] };

  it('rejects zero', () => {
    const r = applyDeduction({ ...base, amountDollars: 0 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('Invalid amount');
  });

  it('rejects negative', () => {
    const r = applyDeduction({ ...base, amountDollars: -50 });
    expect(r.ok).toBe(false);
  });

  it('rejects NaN / non-finite', () => {
    expect(applyDeduction({ ...base, amountDollars: NaN }).ok).toBe(
      false
    );
    expect(
      applyDeduction({ ...base, amountDollars: Infinity }).ok
    ).toBe(false);
  });

  it('rejects amount over the balance', () => {
    const r = applyDeduction({
      ...base,
      amountDollars: 531, // $531 > $530 credit
    });
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.error).toBe('Amount exceeds remaining balance');
  });

  it('over-balance check accounts for prior usage', () => {
    // $530 credit, $500 already used -> only $30 left
    const r = applyDeduction({
      credit: 53000,
      transactions: [tx('a', 50000)],
      amountDollars: 31, // $31 > $30 remaining
    });
    expect(r.ok).toBe(false);
  });
});

describe('applyDeduction — success', () => {
  it('deducts and lowers the balance', () => {
    const r = applyDeduction({
      credit: 110000,
      transactions: [],
      amountDollars: 150,
      note: 'Balayage',
      txId: 'fixed-1',
      now: new Date('2026-06-15T12:00:00.000Z'),
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.balance).toBe(95000);
      expect(r.transaction.amount).toBe(15000);
      expect(r.transaction.note).toBe('Balayage');
      expect(r.transactions).toHaveLength(1);
    }
  });

  it('allows spending the exact remaining balance to zero', () => {
    const r = applyDeduction({
      credit: 53000,
      transactions: [tx('a', 50000)],
      amountDollars: 30, // exactly the $30 left
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.balance).toBe(0);
  });

  it('preserves the service calendar day (noon avoids TZ shift)', () => {
    const r = applyDeduction({
      credit: 53000,
      transactions: [],
      amountDollars: 10,
      date: '2026-03-20',
    });
    expect(r.ok).toBe(true);
    // The exact UTC hour depends on the server TZ; what must never change
    // is the calendar day — noon gives a 12h buffer on each side.
    if (r.ok)
      expect(r.transaction.date.startsWith('2026-03-20')).toBe(
        true
      );
  });

  it('falls back to now for an invalid date', () => {
    const now = new Date('2026-06-15T09:00:00.000Z');
    const r = applyDeduction({
      credit: 53000,
      transactions: [],
      amountDollars: 10,
      date: 'not-a-date',
      now,
    });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.transaction.date).toBe(now.toISOString());
  });

  it('does not mutate the input transactions array', () => {
    const original: Transaction[] = [tx('a', 10000)];
    applyDeduction({
      credit: 53000,
      transactions: original,
      amountDollars: 50,
    });
    expect(original).toHaveLength(1);
  });
});

describe('applyUndo', () => {
  it('restores the balance when removing a usage', () => {
    const transactions = [tx('a', 15000), tx('b', 10000)];
    const r = applyUndo(110000, transactions, 'a');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.balance).toBe(100000); // 110000 - 10000
      expect(r.transactions).toHaveLength(1);
      expect(r.transactions[0].txId).toBe('b');
    }
  });

  it('removing the only usage returns to full credit', () => {
    const r = applyUndo(53000, [tx('a', 20000)], 'a');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.balance).toBe(53000);
  });

  it('errors when the transaction does not exist', () => {
    const r = applyUndo(53000, [tx('a', 10000)], 'ghost');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('Transaction not found');
  });

  it('does not mutate the input array', () => {
    const original = [tx('a', 10000)];
    applyUndo(53000, original, 'a');
    expect(original).toHaveLength(1);
  });
});

describe('beautyBankStats', () => {
  it('empty list is all zero', () => {
    expect(beautyBankStats([])).toEqual({
      totalSold: 0,
      totalOutstanding: 0,
      totalRedeemed: 0,
    });
  });

  it('aggregates credit, outstanding and redeemed from transactions', () => {
    const accounts = [
      { credit: 110000, transactions: [tx('a', 25000)] }, // 85000 left
      { credit: 53000, transactions: [] }, // 53000 left
      { credit: 240500, transactions: [tx('b', 60000)] }, // 180500 left
    ];
    const s = beautyBankStats(accounts);
    expect(s.totalSold).toBe(403500);
    expect(s.totalOutstanding).toBe(318500);
    expect(s.totalRedeemed).toBe(85000);
  });

  it('ignores a drifted stored balance — recomputes from transactions', () => {
    // Even if a 'balance' field were wrong, stats use the transactions
    const accounts = [
      { credit: 53000, transactions: [tx('a', 53000)] },
    ];
    const s = beautyBankStats(accounts);
    expect(s.totalOutstanding).toBe(0);
    expect(s.totalRedeemed).toBe(53000);
  });
});

describe('deduction + undo round trip stays consistent', () => {
  it('returns to the starting balance', () => {
    const credit = 110000;
    let transactions: Transaction[] = [];

    const d = applyDeduction({
      credit,
      transactions,
      amountDollars: 250,
      txId: 'rt-1',
    });
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    transactions = d.transactions;
    expect(computeBalance(credit, transactions)).toBe(85000);

    const u = applyUndo(credit, transactions, 'rt-1');
    expect(u.ok).toBe(true);
    if (!u.ok) return;
    expect(computeBalance(credit, u.transactions)).toBe(
      credit
    );
  });
});

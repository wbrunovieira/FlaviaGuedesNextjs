// src/lib/beauty-bank.ts
// Pure, side-effect-free money logic for the VIP Beauty Bank.
// The balance is ALWAYS derived from credit minus the sum of transactions,
// so it can never drift out of sync. These functions are exhaustively unit
// tested — they handle real client money and must be correct.

export type Transaction = {
  txId: string;
  amount: number; // cents deducted
  note: string | null;
  date: string; // ISO
  createdAt: string; // ISO
};

/**
 * Convert a dollar amount to integer cents, guarding against float drift
 * (e.g. 0.1 * 100 = 10.000000000000002).
 */
export function dollarsToCents(dollars: number): number {
  return Math.round((dollars + Number.EPSILON) * 100);
}

export function sumTransactions(
  transactions: Transaction[]
): number {
  return transactions.reduce((s, t) => s + t.amount, 0);
}

/** The single source of truth for remaining balance. */
export function computeBalance(
  credit: number,
  transactions: Transaction[]
): number {
  return credit - sumTransactions(transactions);
}

function resolveServiceDate(
  date: string | undefined,
  now: Date
): string {
  if (!date) return now.toISOString();
  // Noon avoids timezone shifting the calendar day
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return now.toISOString();
  return d.toISOString();
}

export type DeductionInput = {
  credit: number;
  transactions: Transaction[];
  amountDollars: number;
  note?: string | null;
  date?: string; // YYYY-MM-DD
  txId?: string; // injectable for deterministic tests
  now?: Date; // injectable for deterministic tests
};

export type DeductionResult =
  | {
      ok: true;
      transaction: Transaction;
      transactions: Transaction[];
      balance: number;
    }
  | { ok: false; error: string };

/**
 * Register a usage against an account's credit.
 * Rejects invalid amounts and any amount that exceeds the remaining balance.
 */
export function applyDeduction(
  input: DeductionInput
): DeductionResult {
  const { credit, transactions, amountDollars } = input;

  if (
    typeof amountDollars !== 'number' ||
    !Number.isFinite(amountDollars) ||
    amountDollars <= 0
  ) {
    return { ok: false, error: 'Invalid amount' };
  }

  const amount = dollarsToCents(amountDollars);
  if (amount <= 0) {
    return { ok: false, error: 'Invalid amount' };
  }

  const balance = computeBalance(credit, transactions);
  if (amount > balance) {
    return {
      ok: false,
      error: 'Amount exceeds remaining balance',
    };
  }

  const now = input.now ?? new Date();
  const transaction: Transaction = {
    txId:
      input.txId ??
      `${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
    amount,
    note: input.note ? String(input.note) : null,
    date: resolveServiceDate(input.date, now),
    createdAt: now.toISOString(),
  };

  const newTransactions = [...transactions, transaction];
  return {
    ok: true,
    transaction,
    transactions: newTransactions,
    balance: computeBalance(credit, newTransactions),
  };
}

export type UndoResult =
  | { ok: true; transactions: Transaction[]; balance: number }
  | { ok: false; error: string };

/** Remove a previously-registered usage, restoring the balance. */
export function applyUndo(
  credit: number,
  transactions: Transaction[],
  txId: string
): UndoResult {
  const exists = transactions.some(t => t.txId === txId);
  if (!exists) {
    return { ok: false, error: 'Transaction not found' };
  }
  const newTransactions = transactions.filter(
    t => t.txId !== txId
  );
  return {
    ok: true,
    transactions: newTransactions,
    balance: computeBalance(credit, newTransactions),
  };
}

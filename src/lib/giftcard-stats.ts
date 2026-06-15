// src/lib/giftcard-stats.ts
// Pure logic behind the gift card admin dashboard — filtering, sorting and
// the business stats Flávia reads. Extracted from the component so it can be
// unit tested. Amounts are in cents.

export type GiftCardRecord = {
  name: string;
  giftName?: string;
  amount: number;
  paid?: boolean;
  cancelled?: boolean;
  redeemed?: boolean;
  createdAt: string; // ISO
};

export type GiftCardStatus =
  | 'cancelled'
  | 'redeemed'
  | 'paid'
  | 'pending';

export type StatusFilter =
  | 'all'
  | 'paid'
  | 'pending'
  | 'redeemed'
  | 'unredeemed';

export type DateRange = 'all' | 'today' | 'week' | 'month';

/** Display status, by priority: cancelled → redeemed → paid → pending. */
export function statusOf(card: {
  cancelled?: boolean;
  redeemed?: boolean;
  paid?: boolean;
}): GiftCardStatus {
  if (card.cancelled) return 'cancelled';
  if (card.redeemed) return 'redeemed';
  if (card.paid) return 'paid';
  return 'pending';
}

export function isSameCalendarMonth(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

export function filterGiftCards<T extends GiftCardRecord>(
  cards: T[],
  opts: {
    search?: string;
    status?: StatusFilter;
    dateRange?: DateRange;
  } = {},
  now: Date = new Date()
): T[] {
  let out = cards.slice();

  const search = opts.search?.trim().toLowerCase();
  if (search) {
    out = out.filter(
      c =>
        c.name.toLowerCase().includes(search) ||
        (c.giftName?.toLowerCase().includes(search) ?? false)
    );
  }

  switch (opts.status ?? 'all') {
    case 'paid':
      out = out.filter(c => c.paid === true);
      break;
    case 'pending':
      out = out.filter(c => c.paid !== true);
      break;
    case 'redeemed':
      out = out.filter(c => c.redeemed === true);
      break;
    case 'unredeemed':
      out = out.filter(c => !c.redeemed && !c.cancelled);
      break;
  }

  switch (opts.dateRange ?? 'all') {
    case 'today':
      out = out.filter(
        c =>
          new Date(c.createdAt).toDateString() ===
          now.toDateString()
      );
      break;
    case 'week': {
      const weekAgo = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      out = out.filter(
        c => new Date(c.createdAt) >= weekAgo
      );
      break;
    }
    case 'month':
      // Calendar month — matches the "this month" stat
      out = out.filter(c =>
        isSameCalendarMonth(new Date(c.createdAt), now)
      );
      break;
  }

  return out;
}

export function sortGiftCards<T extends { createdAt: string }>(
  cards: T[],
  order: 'asc' | 'desc'
): T[] {
  return cards.slice().sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();
    return order === 'desc' ? db - da : da - db;
  });
}

export type GiftCardStats = {
  total: number;
  totalSold: number; // cents
  thisMonthCount: number;
  thisMonthSales: number; // cents
  averageTicket: number; // cents
  redeemedCount: number;
  unredeemedCount: number;
};

export function giftCardStats(
  cards: GiftCardRecord[],
  now: Date = new Date()
): GiftCardStats {
  const total = cards.length;
  const totalSold = cards.reduce((s, c) => s + c.amount, 0);
  const thisMonth = cards.filter(c =>
    isSameCalendarMonth(new Date(c.createdAt), now)
  );
  return {
    total,
    totalSold,
    thisMonthCount: thisMonth.length,
    thisMonthSales: thisMonth.reduce(
      (s, c) => s + c.amount,
      0
    ),
    averageTicket:
      total > 0 ? Math.round(totalSold / total) : 0,
    redeemedCount: cards.filter(c => c.redeemed).length,
    unredeemedCount: cards.filter(
      c => !c.redeemed && !c.cancelled
    ).length,
  };
}

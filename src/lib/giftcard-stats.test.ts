import { describe, it, expect } from 'vitest';
import {
  statusOf,
  isSameCalendarMonth,
  filterGiftCards,
  sortGiftCards,
  giftCardStats,
  type GiftCardRecord,
} from './giftcard-stats';

const card = (
  over: Partial<GiftCardRecord> = {}
): GiftCardRecord => ({
  name: 'Maria',
  amount: 10000,
  paid: true,
  createdAt: '2026-06-10T12:00:00.000Z',
  ...over,
});

describe('statusOf — priority order', () => {
  it('cancelled wins over everything', () => {
    expect(
      statusOf({
        cancelled: true,
        redeemed: true,
        paid: true,
      })
    ).toBe('cancelled');
  });
  it('redeemed wins over paid', () => {
    expect(statusOf({ redeemed: true, paid: true })).toBe(
      'redeemed'
    );
  });
  it('paid when only paid', () => {
    expect(statusOf({ paid: true })).toBe('paid');
  });
  it('pending when nothing set', () => {
    expect(statusOf({})).toBe('pending');
  });
});

describe('isSameCalendarMonth', () => {
  it('true within the same month/year', () => {
    expect(
      isSameCalendarMonth(
        new Date('2026-06-05T12:00:00Z'),
        new Date('2026-06-25T12:00:00Z')
      )
    ).toBe(true);
  });
  it('false across month boundary', () => {
    expect(
      isSameCalendarMonth(
        new Date('2026-05-15T12:00:00Z'),
        new Date('2026-06-15T12:00:00Z')
      )
    ).toBe(false);
  });
  it('false same month different year', () => {
    expect(
      isSameCalendarMonth(
        new Date('2025-06-15T12:00:00Z'),
        new Date('2026-06-15T12:00:00Z')
      )
    ).toBe(false);
  });
});

describe('filterGiftCards', () => {
  const cards = [
    card({ name: 'Maria Silva', giftName: 'Ana' }),
    card({ name: 'João', paid: false }),
    card({ name: 'Carla', redeemed: true }),
    card({ name: 'Bruno', cancelled: true, paid: true }),
  ];

  it('search matches buyer or recipient name', () => {
    expect(
      filterGiftCards(cards, { search: 'ana' })
    ).toHaveLength(1); // matches Maria's giftName "Ana"
    expect(
      filterGiftCards(cards, { search: 'João' })
    ).toHaveLength(1);
  });

  it('status paid / pending', () => {
    expect(
      filterGiftCards(cards, { status: 'paid' }).map(
        c => c.name
      )
    ).toEqual(['Maria Silva', 'Carla', 'Bruno']);
    expect(
      filterGiftCards(cards, { status: 'pending' }).map(
        c => c.name
      )
    ).toEqual(['João']);
  });

  it('status unredeemed excludes redeemed and cancelled', () => {
    const r = filterGiftCards(cards, {
      status: 'unredeemed',
    });
    expect(r.map(c => c.name)).toEqual(['Maria Silva', 'João']);
  });

  it('does not mutate the input array', () => {
    const input = [...cards];
    filterGiftCards(input, { status: 'paid' });
    expect(input).toHaveLength(4);
  });

  it('date range "month" uses calendar month, not a rolling 30 days', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    const list = [
      card({ name: 'thisMonth', createdAt: '2026-06-08T12:00:00Z' }),
      card({ name: 'lastMonth26daysAgo', createdAt: '2026-05-20T12:00:00Z' }),
    ];
    const r = filterGiftCards(list, { dateRange: 'month' }, now);
    // The May 20 card is within 30 days but a different calendar month → excluded
    expect(r.map(c => c.name)).toEqual(['thisMonth']);
  });
});

describe('sortGiftCards', () => {
  const a = card({ name: 'a', createdAt: '2026-06-01T00:00:00Z' });
  const b = card({ name: 'b', createdAt: '2026-06-10T00:00:00Z' });
  it('desc = newest first', () => {
    expect(
      sortGiftCards([a, b], 'desc').map(c => c.name)
    ).toEqual(['b', 'a']);
  });
  it('asc = oldest first', () => {
    expect(
      sortGiftCards([a, b], 'asc').map(c => c.name)
    ).toEqual(['a', 'b']);
  });
  it('does not mutate input', () => {
    const input = [a, b];
    sortGiftCards(input, 'asc');
    expect(input[0].name).toBe('a');
  });
});

describe('giftCardStats', () => {
  const now = new Date('2026-06-15T12:00:00Z');

  it('handles an empty list (no divide-by-zero)', () => {
    const s = giftCardStats([], now);
    expect(s).toMatchObject({
      total: 0,
      totalSold: 0,
      thisMonthCount: 0,
      thisMonthSales: 0,
      averageTicket: 0,
      redeemedCount: 0,
      unredeemedCount: 0,
    });
  });

  it('totals, this-month and average ticket', () => {
    const list = [
      card({ amount: 10000, createdAt: '2026-06-02T00:00:00Z' }),
      card({ amount: 5000, createdAt: '2026-06-09T00:00:00Z' }),
      card({ amount: 30000, createdAt: '2026-05-20T00:00:00Z' }), // last month
    ];
    const s = giftCardStats(list, now);
    expect(s.total).toBe(3);
    expect(s.totalSold).toBe(45000);
    expect(s.thisMonthCount).toBe(2);
    expect(s.thisMonthSales).toBe(15000);
    expect(s.averageTicket).toBe(15000); // 45000 / 3
  });

  it('redeemed and unredeemed counts (cancelled excluded from unredeemed)', () => {
    const list = [
      card({ redeemed: true }),
      card({ cancelled: true }),
      card({}),
      card({}),
    ];
    const s = giftCardStats(list, now);
    expect(s.redeemedCount).toBe(1);
    expect(s.unredeemedCount).toBe(2); // 4 - redeemed - cancelled
  });
});

import { describe, it, expect } from 'vitest';
import {
  OWNER_EMAIL,
  isValidEmail,
  buildGiftCardBuyerEmail,
  buildBeautyBankBuyerEmail,
  buildOwnerGiftCardNotification,
  buildOwnerBeautyBankNotification,
} from './email';

describe('isValidEmail', () => {
  it('accepts well-formed addresses', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('maria.silva@email.co')).toBe(true);
    expect(isValidEmail('flavia+gift@flaviaguedes.com')).toBe(
      true
    );
  });

  it('trims surrounding whitespace', () => {
    expect(isValidEmail('  a@b.com  ')).toBe(true);
  });

  it('rejects malformed or empty addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
    expect(isValidEmail('no-at-sign')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false); // no TLD
    expect(isValidEmail('a @b.com')).toBe(false);
    expect(isValidEmail('a@b .com')).toBe(false);
    expect(isValidEmail('a@@b.com')).toBe(false);
  });
});

describe('buildGiftCardBuyerEmail', () => {
  const base = {
    buyerEmail: 'maria@email.com',
    name: 'Maria',
    giftName: 'Ana',
    amountCents: 15000,
    message: 'Te amo',
    locale: 'pt',
  };

  it('returns null when there is no buyer email', () => {
    expect(
      buildGiftCardBuyerEmail({ ...base, buyerEmail: '' })
    ).toBeNull();
    expect(
      buildGiftCardBuyerEmail({
        ...base,
        buyerEmail: null,
      })
    ).toBeNull();
  });

  it('addresses the buyer and replies to the owner', () => {
    const e = buildGiftCardBuyerEmail(base)!;
    expect(e.to).toBe('maria@email.com');
    expect(e.replyTo).toBe(OWNER_EMAIL);
  });

  it('shows the formatted amount and the recipient', () => {
    const e = buildGiftCardBuyerEmail(base)!;
    expect(e.html).toContain('$150.00');
    expect(e.html).toContain('Ana');
    expect(e.html).toContain('Te amo');
  });

  it('formats cents correctly', () => {
    const e = buildGiftCardBuyerEmail({
      ...base,
      amountCents: 5,
    })!;
    expect(e.html).toContain('$0.05');
  });

  it('has a non-empty subject', () => {
    expect(
      buildGiftCardBuyerEmail(base)!.subject.length
    ).toBeGreaterThan(0);
  });
});

describe('buildBeautyBankBuyerEmail', () => {
  const base = {
    buyerEmail: 'ana@email.com',
    name: 'Ana',
    depositCents: 50000,
    creditCents: 52000,
    locale: 'en',
  };

  it('returns null without buyer email', () => {
    expect(
      buildBeautyBankBuyerEmail({ ...base, buyerEmail: null })
    ).toBeNull();
  });

  it('shows credit and deposit', () => {
    const e = buildBeautyBankBuyerEmail(base)!;
    expect(e.to).toBe('ana@email.com');
    expect(e.html).toContain('$520.00'); // credit
    expect(e.html).toContain('$500.00'); // deposit
    expect(e.replyTo).toBe(OWNER_EMAIL);
  });
});

describe('owner notifications', () => {
  it('gift card notification always goes to the owner', () => {
    const e = buildOwnerGiftCardNotification({
      name: 'Maria',
      giftName: 'Ana',
      amountCents: 15000,
      buyerEmail: 'maria@email.com',
    });
    expect(e.to).toBe(OWNER_EMAIL);
    expect(e.html).toContain('Maria');
    expect(e.html).toContain('$150.00');
    expect(e.subject.toLowerCase()).toContain('gift');
  });

  it('beauty bank notification goes to the owner with credit info', () => {
    const e = buildOwnerBeautyBankNotification({
      name: 'Ana',
      depositCents: 100000,
      creditCents: 108000,
      buyerEmail: 'ana@email.com',
    });
    expect(e.to).toBe(OWNER_EMAIL);
    expect(e.html).toContain('$1,000.00'); // deposit
    expect(e.html).toContain('$1,080.00'); // credit
    expect(e.subject.toLowerCase()).toContain('beauty bank');
  });

  it('owner notification does not require a buyer email', () => {
    const e = buildOwnerGiftCardNotification({
      name: 'Walk-in',
      amountCents: 5000,
      buyerEmail: null,
    });
    expect(e.to).toBe(OWNER_EMAIL);
  });
});

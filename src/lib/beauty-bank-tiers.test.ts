import { describe, it, expect } from 'vitest';
import {
  BEAUTY_BANK_TIERS,
  getTier,
} from './beauty-bank-tiers';

describe('beauty bank tiers', () => {
  it('exposes the four approved tiers', () => {
    expect(BEAUTY_BANK_TIERS).toHaveLength(4);
  });

  it('every tier gives credit greater than the deposit (a bonus)', () => {
    for (const t of BEAUTY_BANK_TIERS) {
      expect(t.credit).toBeGreaterThan(t.deposit);
    }
  });

  it('holds the exact approved values (half-fee absorption)', () => {
    expect(getTier('500')).toMatchObject({
      deposit: 50000,
      credit: 52000,
    });
    expect(getTier('1000')).toMatchObject({
      deposit: 100000,
      credit: 108000,
    });
    expect(getTier('1500')).toMatchObject({
      deposit: 150000,
      credit: 166500,
    });
    expect(getTier('2000')).toMatchObject({
      deposit: 200000,
      credit: 240500,
    });
  });

  it('rejects unknown / forged tier ids', () => {
    expect(getTier('999')).toBeUndefined();
    expect(getTier('')).toBeUndefined();
    expect(getTier('50000')).toBeUndefined();
  });
});

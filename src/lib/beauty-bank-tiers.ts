// src/lib/beauty-bank-tiers.ts
// Single source of truth for the VIP Beauty Bank packages.
// Amounts are in cents. `deposit` is what the client pays; `credit` is the
// salon credit they receive (deposit + bonus).

export type BeautyBankTier = {
  id: string;
  deposit: number;
  credit: number;
};

export const BEAUTY_BANK_TIERS: BeautyBankTier[] = [
  { id: '500', deposit: 50000, credit: 53000 },
  { id: '1000', deposit: 100000, credit: 110000 },
  { id: '1500', deposit: 150000, credit: 170000 },
  { id: '2000', deposit: 200000, credit: 245000 },
];

export function getTier(
  id: string
): BeautyBankTier | undefined {
  return BEAUTY_BANK_TIERS.find(t => t.id === id);
}

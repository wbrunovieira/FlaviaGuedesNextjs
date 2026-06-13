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
  { id: '500', deposit: 50000, credit: 52000 },
  { id: '1000', deposit: 100000, credit: 108000 },
  { id: '1500', deposit: 150000, credit: 166500 },
  { id: '2000', deposit: 200000, credit: 240500 },
];

export function getTier(
  id: string
): BeautyBankTier | undefined {
  return BEAUTY_BANK_TIERS.find(t => t.id === id);
}

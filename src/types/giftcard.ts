export interface GiftCard {
  id: string;
  name: string;
  giftName: string;
  phone?: string;
  message?: string;
  amount: number;
  stripePaymentId?: string;
  squarePaymentId?: string;
  paid?: boolean;
  cancelled?: boolean;
  redeemed?: boolean;
  redeemedAt?: string | null;
  createdAt: string;
  paymentMethod?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardType?: string;
}

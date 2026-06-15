'use client';

import { useEffect, useState } from 'react';
import type {
  SquarePaymentsInstance,
  SquareCard,
} from '@/types/square';

const isProduction =
  process.env.NODE_ENV === 'production';

/** Square Web Payments SDK script — sandbox vs production. */
export const SQUARE_SDK_SRC = isProduction
  ? 'https://web.squarecdn.com/v1/square.js'
  : 'https://sandbox.web.squarecdn.com/v1/square.js';

const APPLICATION_ID = isProduction
  ? process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
  : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID;

/**
 * Initializes a Square card field once `active` is true and attaches it to
 * the element with id `containerId`. Returns the card instance (for
 * tokenizing) and any initialization error. Shared by the gift card and
 * Beauty Bank purchase forms.
 */
export function useSquareCard(
  active: boolean,
  containerId: string
) {
  const [card, setCard] = useState<SquareCard | null>(null);
  const [payments, setPayments] =
    useState<SquarePaymentsInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || payments || card) return;
    let cancelled = false;

    const init = async () => {
      let attempts = 0;
      while (!window.Square && attempts < 20) {
        await new Promise(r => setTimeout(r, 500));
        attempts++;
      }
      if (cancelled) return;
      if (!window.Square) {
        setError(
          'Payment system failed to load. Please refresh the page.'
        );
        return;
      }
      try {
        const instance = window.Square.payments(
          APPLICATION_ID!
        );
        if (cancelled) return;
        setPayments(instance);
        const cardInstance = await instance.card();
        if (cancelled) return;
        await cardInstance.attach(`#${containerId}`);
        setCard(cardInstance);
      } catch (e) {
        setError(
          'Payment system initialization failed: ' +
            (e as Error).message
        );
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [active, containerId, card, payments]);

  return { card, error };
}

'use client';

import { useEffect, useState } from 'react';
import type { SquareCard } from '@/types/square';

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
 *
 * Deps are intentionally only [active, containerId]: internal state updates
 * must NOT re-run the effect, or the cleanup would cancel the in-flight init
 * before the card attaches.
 */
export function useSquareCard(
  active: boolean,
  containerId: string
) {
  const [card, setCard] = useState<SquareCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
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
        const payments = window.Square.payments(
          APPLICATION_ID!
        );
        const cardInstance = await payments.card();
        if (cancelled) return;
        await cardInstance.attach(`#${containerId}`);
        if (cancelled) return;
        setCard(cardInstance);
      } catch (e) {
        if (!cancelled) {
          setError(
            'Payment system initialization failed: ' +
              (e as Error).message
          );
        }
      }
    };

    init();
    return () => {
      cancelled = true;
      setCard(null);
    };
  }, [active, containerId]);

  return { card, error };
}

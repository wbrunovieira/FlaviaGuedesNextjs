'use client';

import { useEffect } from 'react';

// When landing on /{locale}#section from an external link, images and
// fonts that load after the initial scroll push the layout down and the
// browser ends up anchored at the wrong section. Re-scroll to the hash
// a few times while the layout settles.
export default function HashScrollFix() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let cancelled = false;
    const scrollToHash = () => {
      if (cancelled) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({
          behavior: 'instant' as ScrollBehavior,
          block: 'start',
        });
      }
    };

    const timeouts = [100, 400, 900, 1600, 2500].map(ms =>
      setTimeout(scrollToHash, ms)
    );
    window.addEventListener('load', scrollToHash);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      window.removeEventListener('load', scrollToHash);
    };
  }, []);

  return null;
}

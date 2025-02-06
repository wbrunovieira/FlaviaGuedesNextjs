import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'pt'],

  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true,
});

console.log('locales do routing', routing.locales);
console.log(
  'locales do routing localeDetection',
  routing.localeDetection
);
console.log(' routing', routing);

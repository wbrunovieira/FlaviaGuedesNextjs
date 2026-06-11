// src/app/page.tsx
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

function parseAcceptLanguage(
  acceptLanguage: string
): string {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.split(';q=');
      return {
        code: code.trim(),
        q: qValue ? parseFloat(qValue) : 1.0,
      };
    })

    .sort((a, b) => b.q - a.q);
  return languages[0]?.code || '';
}

export default async function RootPage() {
  const requestHeaders = await headers();
  const acceptLanguage =
    requestHeaders.get('accept-language') || '';

  const preferred = parseAcceptLanguage(acceptLanguage);

  let locale: 'en' | 'pt' = 'en';
  if (preferred.toLowerCase().includes('pt')) {
    locale = 'pt';
  } else if (preferred.toLowerCase().includes('en')) {
    locale = 'en';
  } else {
    locale = 'en';
  }

  redirect(`/${locale}`);
}

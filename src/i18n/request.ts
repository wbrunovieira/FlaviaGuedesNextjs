import { getRequestConfig } from 'next-intl/server';
import type { AbstractIntlMessages } from 'next-intl';
import { routing } from './routing';
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

export default getRequestConfig(
  async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale) {
      const reqHeaders = await headers();
      const acceptLanguage =
        reqHeaders.get('accept-language') || '';

      const preferred = parseAcceptLanguage(acceptLanguage);

      if (preferred.toLowerCase().includes('pt')) {
        locale = 'pt';
      } else if (preferred.toLowerCase().includes('en')) {
        locale = 'en';
      } else {
        locale = routing.defaultLocale;
      }
    }

    if (locale !== 'en' && locale !== 'pt') {
      locale = routing.defaultLocale;
    }

    const messages = (
      await (locale === 'pt'
        ? import('../../messages/pt.json')
        : import('../../messages/en.json'))
    ).default;

    return {
      locale,
      messages: messages as unknown as AbstractIntlMessages,
    };
  }
);

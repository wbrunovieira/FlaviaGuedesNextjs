import { getRequestConfig } from 'next-intl/server';
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
    console.log(
      'locale do request antes do tratamento:',
      locale
    );

    if (!locale) {
      const reqHeaders = await headers();
      const acceptLanguage =
        reqHeaders.get('accept-language') || '';
      console.log(
        'accept-language header:',
        acceptLanguage
      );

      const preferred = parseAcceptLanguage(acceptLanguage);
      console.log(
        'preferred language from header:',
        preferred
      );

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
    console.log(
      'locale do request após tratamento:',
      locale
    );

    const messages = (
      await (locale === 'pt'
        ? import('../../messages/pt.json')
        : import('../../messages/en.json'))
    ).default;

    return {
      locale,
      messages,
    };
  }
);

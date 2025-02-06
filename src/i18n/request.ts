import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { headers } from 'next/headers';

export default getRequestConfig(
  async ({ requestLocale }) => {
    // Tenta extrair o locale diretamente da requisição
    let locale = await requestLocale;
    console.log(
      'locale do request antes do tratamento:',
      locale
    );

    // Se requestLocale estiver indefinido, usa o cabeçalho 'accept-language' como fallback
    if (!locale) {
      const reqHeaders = await headers(); // <-- Adiciona await aqui
      const acceptLanguage =
        reqHeaders.get('accept-language') || '';
      console.log(
        'accept-language header:',
        acceptLanguage
      );

      if (acceptLanguage.toLowerCase().includes('pt')) {
        locale = 'pt';
      } else {
        locale = routing.defaultLocale; // geralmente 'en'
      }
    }

    // Garante que locale seja 'en' ou 'pt'
    if (locale !== 'en' && locale !== 'pt') {
      locale = routing.defaultLocale;
    }
    console.log(
      'locale do request após tratamento:',
      locale
    );

    // Importa as mensagens conforme o locale definido
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

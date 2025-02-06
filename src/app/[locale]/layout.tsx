// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import '../../app/globals.css';

export const metadata: Metadata = {
  title: 'Flavia Guedes',
  description: '',
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }];
}

export default async function RootLocaleLayout(props: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const params = await props.params;
  console.log('params no layout locale', params);
  const locale = params.locale;
  console.log(' no layout locale', locale);
  const messages = (
    await (locale === 'pt'
      ? import('../../../messages/pt.json')
      : import('../../../messages/en.json'))
  ).default;

  console.log('messages do layout locale', messages);
  console.log('params do layout locale', params);

  return (
    <html lang={locale}>
      <head>
        <title>Flavia Guedes</title>
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

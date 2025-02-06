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
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await props.params;
  const locale = resolvedParams.locale;
  const messages = (
    await (locale === 'pt'
      ? import('../../../messages/pt.json')
      : import('../../../messages/en.json'))
  ).default;

  return (
    <html lang={locale}>
      <body>
        {/* Adicionamos key={locale} para forçar a remount quando o locale mudar */}
        <NextIntlClientProvider
          key={locale}
          locale={locale}
          messages={messages}
        >
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

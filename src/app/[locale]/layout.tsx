// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import { Merriweather, Work_Sans } from 'next/font/google';
import '../../app/globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

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
    <html lang={locale} className={`${workSans.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className={workSans.className} suppressHydrationWarning>
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

// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import {
  Fraunces,
  Merriweather,
  Work_Sans,
} from 'next/font/google';
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

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const SITE_URL = 'https://flaviaguedes.com';

const seo = {
  en: {
    title:
      'Flavia Guedes | Hair Stylist & Colorist in Fort Lauderdale',
    description:
      'Flavia Guedes — Brazilian hair stylist and colorist at iFierce Beauty Lounge in Fort Lauderdale, FL. Balayage, highlights, keratin treatments, precision haircuts and gift cards. Book your appointment.',
  },
  pt: {
    title:
      'Flavia Guedes | Hair Stylist e Colorista em Fort Lauderdale',
    description:
      'Flavia Guedes — hair stylist e colorista brasileira no iFierce Beauty Lounge em Fort Lauderdale, FL. Balayage, mechas, queratina, cortes de precisão e gift cards. Agende seu horário.',
  },
} as const;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = locale === 'pt' ? seo.pt : seo.en;

  return {
    metadataBase: new URL(SITE_URL),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', pt: '/pt' },
    },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName: 'Flavia Guedes',
      title: t.title,
      description: t.description,
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Flavia Guedes — Hair Stylist',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: ['/images/og-image.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

// Address, hours and coordinates match the salon's Square location
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: 'Flavia Guedes — iFierce Beauty Lounge',
  image: `${SITE_URL}/images/og-image.jpg`,
  url: SITE_URL,
  telephone: '+1-954-464-7349',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2685 E Oakland Park Blvd',
    addressLocality: 'Fort Lauderdale',
    addressRegion: 'FL',
    postalCode: '33306',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.1676865,
    longitude: -80.1120119,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Tuesday',
      opens: '10:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Wednesday',
      opens: '09:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Thursday',
      opens: '10:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '09:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '17:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/flaviaguedesstylist/',
    'https://app.salonrunner.com/customer/home/ifiercebeautylounge/index.htm',
  ],
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
    <html lang={locale} className={`${workSans.variable} ${merriweather.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className={workSans.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          {props.children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

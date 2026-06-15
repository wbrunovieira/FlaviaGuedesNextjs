import type { Metadata } from 'next';

const seo = {
  en: {
    title:
      'Flavia Guedes — Brazilian Hair Stylist & Colorist | My Story',
    description:
      'The story of Flavia Guedes — 20+ years as a hair stylist and colorist in Fort Lauderdale, specializing in natural-looking blondes, balayage, dimensional color and gray coverage at iFierce Beauty Lounge.',
  },
  pt: {
    title:
      'Flavia Guedes — Hair Stylist e Colorista Brasileira | Minha História',
    description:
      'A história da Flavia Guedes — mais de 20 anos como hair stylist e colorista em Fort Lauderdale, especialista em loiros naturais, balayage, cor dimensional e cobertura de grisalhos no iFierce Beauty Lounge.',
  },
} as const;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = locale === 'pt' ? seo.pt : seo.en;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        pt: '/pt/about',
        'x-default': '/en/about',
      },
    },
    openGraph: {
      type: 'profile',
      url: `/${locale}/about`,
      title: t.title,
      description: t.description,
      images: [
        { url: '/images/og-image.jpg', width: 1200, height: 630 },
      ],
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

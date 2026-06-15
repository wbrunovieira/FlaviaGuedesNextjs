import type { Metadata } from 'next';

const seo = {
  en: {
    title: 'Salon Policies | Flavia Guedes',
    description:
      'Flavia Guedes salon policies — cancellations, deposits, gift cards, refunds and more for clients at iFierce Beauty Lounge, Fort Lauderdale.',
  },
  pt: {
    title: 'Políticas do Salão | Flavia Guedes',
    description:
      'Políticas do salão da Flavia Guedes — cancelamentos, depósitos, gift cards, reembolsos e mais para clientes no iFierce Beauty Lounge, Fort Lauderdale.',
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
      canonical: `/${locale}/policies`,
      languages: {
        en: '/en/policies',
        pt: '/pt/policies',
        'x-default': '/en/policies',
      },
    },
    openGraph: {
      type: 'website',
      url: `/${locale}/policies`,
      title: t.title,
      description: t.description,
      images: [
        { url: '/images/og-image.jpg', width: 1200, height: 630 },
      ],
    },
  };
}

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

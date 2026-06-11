import type { MetadataRoute } from 'next';

const SITE_URL = 'https://flaviaguedes.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          pt: `${SITE_URL}/pt`,
        },
      },
    },
    {
      url: `${SITE_URL}/pt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          pt: `${SITE_URL}/pt`,
        },
      },
    },
  ];
}

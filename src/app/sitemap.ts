import type { MetadataRoute } from 'next';

const SITE_URL = 'https://flaviaguedes.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const localized = (path: string) => ({
    en: `${SITE_URL}/en${path}`,
    pt: `${SITE_URL}/pt${path}`,
  });

  const entries: MetadataRoute.Sitemap = [];

  for (const path of ['', '/about']) {
    for (const locale of ['en', 'pt']) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.8,
        alternates: { languages: localized(path) },
      });
    }
  }

  return entries;
}

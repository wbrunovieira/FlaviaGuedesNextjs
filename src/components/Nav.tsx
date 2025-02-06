'use client';
// src/components/Nav.tsx
import { useLocale, useTranslations } from 'next-intl';

export default function Nav() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const alternateLocale = locale === 'pt' ? 'en' : 'pt';

  const switchLanguage = () => {
    window.location.href = `/${alternateLocale}`;
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-6">
          <a
            href={`/${locale}`}
            className="text-2xl font-bold"
          >
            {t('logo', { defaultValue: 'MyApp' })}
          </a>
          <ul className="hidden md:flex space-x-4">
            <li>
              <a
                href={`/${locale}`}
                className="hover:text-gray-300"
              >
                {t('home', { defaultValue: 'Home' })}
              </a>
            </li>
            <li>
              <a
                href={`/${locale}/about`}
                className="hover:text-gray-300"
              >
                {t('about', { defaultValue: 'About' })}
              </a>
            </li>
            <li>
              <a
                href={`/${locale}/contact`}
                className="hover:text-gray-300"
              >
                {t('contact', { defaultValue: 'Contact' })}
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={switchLanguage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {t('switchLanguage', {
              defaultValue: `Switch to ${alternateLocale.toUpperCase()}`,
            })}
          </button>
        </div>
      </div>

      <div className="md:hidden mt-4">
        <ul className="flex flex-col space-y-2">
          <li>
            <a
              href={`/${locale}`}
              className="hover:text-gray-300"
            >
              {t('home', { defaultValue: 'Home' })}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/about`}
              className="hover:text-gray-300"
            >
              {t('about', { defaultValue: 'About' })}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/contact`}
              className="hover:text-gray-300"
            >
              {t('contact', { defaultValue: 'Contact' })}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

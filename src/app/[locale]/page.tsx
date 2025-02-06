import { useLocale, useTranslations } from 'next-intl';

export default function Index() {
  const t = useTranslations('Index');
  const locale = useLocale();

  console.log('locavle no page', locale);

  return (
    <div>
      <p>Locale atual: {locale}</p>
      <p>{t('greeting')}</p>
    </div>
  );
}

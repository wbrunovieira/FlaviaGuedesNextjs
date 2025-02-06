// src/app/[locale]/page.tsx
import ButtonAnimatedGradient from '@/components/ButtonAnimatedGradient';
import Nav from '@/components/Nav';
import ToggleButton from '@/components/ToggleButton';
import { useLocale, useTranslations } from 'next-intl';

export default function Index() {
  const t = useTranslations('Index');
  const locale = useLocale();

  console.log('locavle no page', locale);

  return (
    <div>
      <Nav />
      <ButtonAnimatedGradient text="Clique Aqui" />
    </div>
  );
}

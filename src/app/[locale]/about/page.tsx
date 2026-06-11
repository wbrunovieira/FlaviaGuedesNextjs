'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaRegCalendarCheck } from 'react-icons/fa';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SectionReveal from '@/components/ui/SectionReveal';

const BOOKING_URL =
  'https://app.salonrunner.com/customer/home/ifiercebeautylounge/index.htm';

export default function AboutStoryPage() {
  const t = useTranslations('AboutPage');

  const storyBeforeQuote = [t('p1'), t('p2')];
  const storyAfterQuote = [
    t('p3'),
    t('p4'),
    t('p5'),
    t('p6'),
    t('p7'),
    t('p8'),
    t('p9'),
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="bg-atmosphere" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      <main className="relative z-10">
        <Nav />

        <article className="mx-auto max-w-2xl px-6 pb-20 pt-28 md:pt-32">
          {/* Hero */}
          <SectionReveal>
            <header className="text-center">
              <div className="mx-auto h-36 w-36 rounded-full bg-gradient-to-br from-gold via-yellow-700 to-gold p-[3px] shadow-lg shadow-gold/25">
                <Image
                  src="/images/flavia.webp"
                  alt="Flavia Guedes"
                  width={288}
                  height={288}
                  priority
                  className="h-full w-full rounded-full bg-black object-cover object-[50%_22%]"
                />
              </div>
              <h1 className="mt-6 font-display text-4xl md:text-5xl font-bold text-foreground">
                {t('heroTitle')}
              </h1>
              <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-gold/70">
                {t('heroSubtitle')}
              </p>
              <div className="mx-auto my-8 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            </header>
          </SectionReveal>

          {/* História */}
          <SectionReveal>
            <div className="space-y-6 text-base leading-relaxed text-gray-300">
              {storyBeforeQuote.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal>
            <blockquote className="my-10 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-gold">
              {t('quote1')}
            </blockquote>
          </SectionReveal>

          <SectionReveal>
            <div className="space-y-6 text-base leading-relaxed text-gray-300">
              {storyAfterQuote.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </SectionReveal>

          {/* Novas clientes — 15% */}
          <SectionReveal>
            <section className="mt-12 rounded-xl border border-gold/30 bg-gradient-to-b from-graphite to-black/60 p-8 text-center">
              <h2 className="font-display text-2xl text-gold">
                {t('guestsTitle')}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                {t('guestsP1')}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {t('guestsP2')}
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-background shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-opacity-90"
              >
                <FaRegCalendarCheck />
                {t('guestsCta')}
              </a>
            </section>
          </SectionReveal>

          {/* Missão */}
          <SectionReveal>
            <section className="mt-12 text-center">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-gold/60">
                {t('missionTitle')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-300">
                {t('missionP1')}
              </p>
              <p className="mt-3 font-display text-xl italic text-foreground">
                {t('missionP2')}
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-300">
                {t('missionP3')}
              </p>
            </section>
          </SectionReveal>

          {/* Lema */}
          <SectionReveal>
            <section className="mt-14 text-center">
              <div className="mx-auto mb-6 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-gold/60">
                {t('mottoTitle')}
              </h2>
              <blockquote className="mx-auto mt-4 max-w-xl font-display text-2xl italic leading-snug text-gold">
                {t('motto')}
              </blockquote>
              <p className="mt-4 text-sm text-grayMedium">
                {t('signature')}
              </p>
            </section>
          </SectionReveal>
        </article>

        <Footer />
      </main>
    </div>
  );
}

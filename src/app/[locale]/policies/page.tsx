'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  FaRegCalendarCheck,
  FaChevronDown,
} from 'react-icons/fa';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SectionReveal from '@/components/ui/SectionReveal';

const BOOKING_URL =
  'https://app.salonrunner.com/customer/home/ifiercebeautylounge/index.htm';

type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: string;
  note?: string;
};

export default function PoliciesPage() {
  const t = useTranslations('Policies');
  const tAbout = useTranslations('AboutPage');
  const sections = t.raw('sections') as PolicySection[];

  // First section open by default
  const [openId, setOpenId] = useState<string | null>(
    sections[0]?.id ?? null
  );

  // When arriving via #anchor (e.g. from the gift card form), open and
  // scroll to that section
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !sections.some(s => s.id === hash)) return;
    setOpenId(hash);
    setTimeout(() => {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, [sections]);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="bg-atmosphere" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      <main className="relative z-10">
        <Nav />

        <div className="mx-auto max-w-3xl px-6 pb-20 pt-28 md:pt-32">
          {/* Header */}
          <SectionReveal>
            <header className="text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {t('pageTitle')}
              </h1>
              <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-gold/70">
                {t('pageSubtitle')}
              </p>
              <div className="mx-auto my-8 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-300">
                {t('intro')}
              </p>
            </header>
          </SectionReveal>

          {/* Accordion de políticas */}
          <div className="mt-12 space-y-3">
            {sections.map(section => {
              const isOpen = openId === section.id;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-28 overflow-hidden rounded-xl border transition-colors duration-300 ${
                    isOpen
                      ? 'border-gold/50 bg-graphite/50'
                      : 'border-gold/15 bg-graphite/30'
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenId(isOpen ? null : section.id)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-gold/5"
                  >
                    <span className="font-display text-lg text-gold">
                      {section.title}
                    </span>
                    <FaChevronDown
                      className={`shrink-0 text-sm text-gold/70 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1">
                        <div className="mb-4 h-px w-16 bg-gradient-to-r from-gold/50 to-transparent" />

                        {section.paragraphs && (
                          <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                            {section.paragraphs.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        )}

                        {section.bullets && (
                          <ul className="mt-4 space-y-2">
                            {section.bullets.map((b, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm leading-relaxed text-gray-300"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.quote && (
                          <blockquote className="mt-4 border-l-2 border-gold/60 pl-4 text-sm italic leading-relaxed text-gold/90">
                            {section.quote}
                          </blockquote>
                        )}

                        {section.note && (
                          <p className="mt-4 text-sm italic text-gold/80">
                            {section.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA final */}
          <SectionReveal>
            <div className="mt-12 rounded-xl border border-gold/30 bg-gradient-to-b from-graphite to-black/60 p-8 text-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-background shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-opacity-90"
              >
                <FaRegCalendarCheck />
                {tAbout('guestsCta')}
              </a>
            </div>
          </SectionReveal>
        </div>

        <Footer />
      </main>
    </div>
  );
}

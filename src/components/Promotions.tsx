'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  FaUserFriends,
  FaRegSmile,
  FaStar,
  FaArrowRight,
  FaCheck,
} from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

function HairStrands() {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none text-gold opacity-[0.08]"
      aria-hidden
    >
      <svg
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <path d="M350,0 Q130,200 150,900" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M360,0 Q140,200 160,890" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M340,0 Q120,200 140,910" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M550,0 Q130,200 150,700" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M540,0 Q140,200 140,710" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M560,0 Q120,200 160,690" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M250,0 Q130,200 150,600" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M250,0 Q130,200 150,500" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M240,0 Q140,200 160,610" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M260,0 Q120,200 140,590" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    </div>
  );
}

export default function Promotions() {
  const t = useTranslations('Promotions');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray(
      '.promotion-card'
    ) as HTMLElement[];

    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, []);

  const welcomeItems = [
    t('welcomeItem1') ||
      'Base Color – Refresh or enhance your hair color',
    t('welcomeItem2') ||
      'Glossing or Conditioning Treatment – For shine and hydration, giving your hair a healthy glow',
    t('welcomeItem3') ||
      'Precision Haircut & Blowout – A flawless finish to complete your look',
  ];

  return (
    <section
      id="promotions"
      ref={sectionRef}
      className="max-w-6xl mx-auto px-6 py-16 relative mt-16"
    >
      {/* Cabeçalho da Seção */}
      <div className="section-header text-center mb-20 relative">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t('sectionTitle') || 'Exclusive Promotions'}
        </h2>
        <p className="text-lg text-grayMedium mb-8 max-w-2xl mx-auto">
          {t('sectionSubtitle') ||
            'Discover our special offers and elevate your style!'}
        </p>
        <div className="flex justify-center items-center">
          <div className="h-px w-1/4 bg-gradient-to-r from-transparent to-gold/60" />
          <FaStar className="mx-4 text-gold text-xl" />
          <div className="h-px w-1/4 bg-gradient-to-l from-transparent to-gold/60" />
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 items-stretch">
        {/* Card 1 — Programa de Indicação */}
        <div className="promotion-card group relative flex flex-col rounded-xl border border-gold/15 bg-gradient-to-b from-graphite to-black/60 p-8 pt-12 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(200,160,75,0.3)]">
          <HairStrands />
          {/* Ícone flutuante */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-background p-4 shadow-xl transition-colors duration-500 group-hover:border-gold">
            <FaUserFriends className="text-gold text-2xl" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/70 text-center">
            {t('referralSubtitle') ||
              'Spread the Love and Enjoy Fantastic Rewards! 🎉'}
          </span>

          <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mt-3 leading-snug">
            {t('referralTitle') ||
              'The Best Compliment I Could Receive? A Referral from You! 😊'}
          </h3>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <p className="text-grayMedium leading-relaxed mt-6 flex-1">
            {t('referralDescription') ||
              'If you love your hair as much as I do, why not share that joy? At iFierce Beauty Lounge, we’ve created a special referral program for you!'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <a
              href="https://www.instagram.com/flaviaguedesstylist/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-background transition-all duration-300 hover:bg-opacity-90 hover:gap-3"
            >
              {t('learnMore') || 'Ask How It Works'}
              <FaArrowRight className="text-sm" />
            </a>
            <p className="text-xs italic text-gray-500">
              {t('referralTerms') ||
                'Valid for new clients only.'}
            </p>
          </div>
        </div>

        {/* Card 2 — Boas-vindas para novos clientes */}
        <div className="promotion-card group relative flex flex-col rounded-xl border border-gold/15 bg-gradient-to-b from-graphite to-black/60 p-8 pt-12 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(200,160,75,0.3)]">
          <HairStrands />
          {/* Ícone flutuante */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-background p-4 shadow-xl transition-colors duration-500 group-hover:border-gold">
            <FaRegSmile className="text-gold text-2xl" />
          </div>

          <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mt-3 leading-snug">
            {t('welcomeTitle') ||
              'Welcome Special for New Clients! 🌟'}
          </h3>

          {/* Preço em destaque */}
          <div className="mt-6 text-center">
            <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-grayMedium">
              {t('welcomePriceLabel') || 'Complete package'}
            </span>
            <span className="mt-1 block font-display text-5xl font-semibold text-gold">
              $150
            </span>
          </div>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <p className="text-grayMedium leading-relaxed mt-6">
            {t('welcomeDescription') ||
              'Are you ready for a fabulous hair transformation? We’ve created a delightful experience just for you!'}
          </p>

          <ul className="mt-6 space-y-3 flex-1">
            {welcomeItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <FaCheck className="text-[10px]" />
                </span>
                <span className="text-sm text-grayMedium leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <a
              href="https://app.salonrunner.com/customer/home/ifiercebeautylounge/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-background transition-all duration-300 hover:bg-opacity-90 hover:gap-3"
            >
              {t('bookNow') || 'Book Now'}
              <FaArrowRight className="text-sm" />
            </a>
            <p className="text-xs italic text-gray-500">
              {t('welcomeAppointment') ||
                'Appointment only, with Flavia Stylists.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

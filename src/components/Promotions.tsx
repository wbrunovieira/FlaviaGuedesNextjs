'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  FaUserFriends,
  FaRegSmile,
  FaStar,
  FaArrowRight,
} from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function Promotions() {
  const t = useTranslations('Promotions');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray(
      '.promotion-card'
    ) as HTMLElement[];

    cards.forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 150,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

    if (sectionRef.current) {
      gsap.from(
        sectionRef.current.querySelector('.section-header'),
        {
          opacity: 0,
          y: -130,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.4,
        }
      );
    }
  }, []);

  return (
    <section
      id="promotions"
      ref={sectionRef}
      className="max-w-6xl mx-auto px-6 py-16 relative overflow-hidden mt-16"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-10 pointer-events-none" />

      {/* Cabeçalho da Seção */}
      <div className="section-header text-center mb-16 relative">
        <h1 className="text-5xl font-extrabold text-foreground mb-4">
          {t('sectionTitle') || 'Exclusive Promotions'}
        </h1>
        <p className="text-xl text-foreground mb-6">
          {t('sectionSubtitle') ||
            'Discover our special offers and elevate your style!'}
        </p>
        <div className="flex justify-center items-center">
          <hr className="w-1/4 border-t-2 border-gold" />
          <FaStar className="mx-3 text-gold text-3xl" />
          <hr className="w-1/4 border-t-2 border-gold" />
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Card Promotion 1 */}
        <div className="promotion-card p-8 bg-background shadow-2xl rounded-lg border border-gold relative group hover:scale-105 transition-transform duration-300">
          {/* Linhas curvas de fundo na vertical */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              viewBox="0 0 800 1000"
              className="w-full h-full opacity-20"
            >
              {/* Fio principal */}
              <path
                d="M350,0 Q130,200 150,900"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              {/* Variação próxima do fio principal */}
              <path
                d="M360,0 Q140,200 160,890"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M340,0 Q120,200 140,910"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />

              {/* Fios do lado direito */}
              <path
                d="M550,0 Q130,200 150,700"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M540,0 Q140,200 140,710"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M560,0 Q120,200 160,690"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />

              {/* Fios do lado esquerdo */}
              <path
                d="M250,0 Q130,200 150,600"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M250,0 Q130,200 150,500"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M240,0 Q140,200 160,610"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M260,0 Q120,200 140,590"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
          {/* Ícone decorativo */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background p-3 rounded-full shadow-xl border border-gold">
            <FaUserFriends className="text-gold text-4xl" />
          </div>
          <div className="mt-10 relative z-10">
            <h2 className="text-3xl font-bold text-gold mb-4">
              {t('referralTitle') ||
                'The Best Compliment I Could Receive? A Referral from You! 😊'}
            </h2>
            <h3 className="text-xl font-semibold text-gold mb-3">
              {t('referralSubtitle') ||
                'Spread the Love and Enjoy Fantastic Rewards! 🎉'}
            </h3>

            <div className="flex justify-center items-center my-8">
              <hr className="w-1/2 border-t-2 border-gold" />
            </div>

            <p className="text-foreground mb-4 mt-4">
              {t('referralDescription') ||
                'If you love your hair as much as I do, why not share that joy? At iFierce Beauty Lounge, we’ve created a special referral program for you!'}
            </p>
            <div className="flex items-center justify-between mt-6">
              <button className="px-6 py-3 bg-gold text-background font-semibold rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center">
                {t('learnMore') || 'Learn More'}{' '}
                <FaArrowRight className="ml-2" />
              </button>
              <p className="text-sm text-foreground italic">
                {t('referralTerms') ||
                  'Valid for new clients only, 2025.'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Promotion 2 */}
        <div className="promotion-card p-8 bg-background shadow-2xl rounded-lg border border-gold relative group hover:scale-105 transition-transform duration-300">
          {/* Linhas curvas de fundo na vertical */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full opacity-20"
            >
              <path
                d="M350,0 Q130,200 150,900"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M350,0 Q130,200 150,800"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M550,0 Q130,200 150,700"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M250,0 Q130,200 150,600"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M250,0 Q130,200 150,500"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
          {/* Ícone decorativo */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background p-3 rounded-full shadow-xl border border-gold">
            <FaRegSmile className="text-gold text-4xl" />
          </div>
          {/* Badge de Preço */}
          <div className="absolute top-4 right-4 bg-gold text-background px-3 py-1 rounded-full font-bold text-3xl z-10">
            $150
          </div>
          <div className="mt-10 relative z-10">
            <h2 className="text-3xl font-bold text-gold mb-4">
              {t('welcomeTitle') ||
                'Welcome Special for New Clients - 2025! 🌟'}
            </h2>
            <div className="flex justify-center items-center my-8">
              <hr className="w-1/2 border-t-2 border-gold" />
            </div>
            <p className="text-foreground mb-4">
              {t('welcomeDescription') ||
                'Are you ready for a fabulous hair transformation? We’ve created a delightful experience just for you!'}
            </p>
            <ul className="list-disc list-inside text-foreground mb-4">
              <li className="mb-1">
                {t('welcomeItem1') ||
                  'Base Color – Refresh or enhance your hair color'}
              </li>
              <li className="mb-1">
                {t('welcomeItem2') ||
                  'Glossing or Conditioning Treatment – For shine and hydration, giving your hair a healthy glow'}
              </li>
              <li>
                {t('welcomeItem3') ||
                  'Precision Haircut & Blowout – A flawless finish to complete your look'}
              </li>
            </ul>
            <div className="flex items-center justify-between mt-6">
              <button className="px-6 py-3 bg-gold text-background font-semibold rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center">
                {t('bookNow') || 'Book Now'}{' '}
                <FaArrowRight className="ml-2" />
              </button>
              <p className="text-sm text-foreground italic ml-4">
                {t('welcomeAppointment') ||
                  'Appointment only, with Flavia Stylists.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

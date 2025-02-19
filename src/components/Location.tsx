'use client';

import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

type LocationProps = {
  id?: string;
};

export default function Location({
  id = 'location',
}: LocationProps) {
  const t = useTranslations('Location');
  const locationRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(locationRef.current, {
      autoAlpha: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
    });
  }, []);

  return (
    <section
      ref={locationRef}
      id={id}
      className="relative container w-full py-16 px-6 md:px-12 lg:px-20 text-white overflow-hidden mx-auto mt-32"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(200,160,75,0.7) 0%, transparent 15%),
          radial-gradient(circle at bottom right, rgba(200,160,75,0.7) 0%, transparent 15%),
          black
        `,
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="mb-6">
            <Image
              src="/images/ifierce.png"
              alt="iFierce Salon Logo"
              width={200}
              height={80}
              className="mx-auto md:mx-0"
              priority
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-300 text-lg mb-4">
            {t('subtitle')}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-gold whitespace-pre-line">
            {t('address')}
          </p>
          <a
            href="https://maps.app.goo.gl/BKrFYp7Dt9FokxM5A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 bg-gold text-black font-medium rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {t('buttonLabel')}
          </a>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full h-[300px] md:h-[400px] max-w-lg bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/location-salon.jpg"
              alt="Salão iFierce"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}

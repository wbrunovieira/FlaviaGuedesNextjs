'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import ButtonAnimatedGradient from './ButtonAnimatedGradient';
import { GiHairStrands } from 'react-icons/gi';

import { SparklesHero } from './SparklesHero';
import ImageSliderHero from './ImageSliderHero';

export default function Hero() {
  const t = useTranslations('Hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState<'sm' | 'lg'>(
    'lg'
  );

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(window.innerWidth < 768 ? 'sm' : 'lg');
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(textRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5,
    });

    gsap.from(imageRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.8,
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative mt-24 md:mt-0 flex flex-col md:flex-row items-center justify-between min-h-screen px-6 md:px-12 lg:px-20 bg-black text-white"
    >
      <div
        ref={textRef}
        className="w-full max-w-2xl text-center md:text-left flex flex-col items-center md:items-start"
      >
        <h1 className="text-4xl sm:text-5xl md:text-5xl font-serif leading-tight">
          {t('title1')}
        </h1>
        <p className="text-4xl sm:text-5xl md:text-4xl font-serif leading-tight text-gold mt-2">
          {t('title2')}
        </p>
        <div className="w-1/2">
          <SparklesHero />
        </div>

        <div className="flex items-start md:justify-start gap-0 md:gap-2 mt-4 w-full p-2 sm:p-4">
          <GiHairStrands className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold flex-shrink-0" />{' '}
          <p className="text-base sm:text-lg md:text-lg text-gray-300 break-words whitespace-normal md:w-1/2">
            {t('description')}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          <ButtonAnimatedGradient
            size={buttonSize}
            className="w-auto min-w-[150px] md:w-auto border border-white bg-transparent hover:bg-white hover:text-black "
            onClick={() => alert(t('bookNow'))}
          >
            {t('bookNow')}
          </ButtonAnimatedGradient>
          <ButtonAnimatedGradient
            size={buttonSize}
            className="w-auto min-w-[150px] md:w-auto border border-white bg-transparent hover:bg-white hover:text-black"
          >
            {t('exploreServices')}
          </ButtonAnimatedGradient>
        </div>
      </div>

      <div
        ref={imageRef}
        className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
      >
        <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-6 md:px-12 lg:px-20 bg-black text-white">
          <ImageSliderHero />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

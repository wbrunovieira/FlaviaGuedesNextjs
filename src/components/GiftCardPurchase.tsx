'use client';

import React from 'react';
import { FaGift, FaArrowRight } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { SparklesHero } from './SparklesHero';

const GiftCardPurchase: React.FC = () => {
  const t = useTranslations('GiftCard');

  const handlePurchase = () => {
    alert(t('purchaseSuccess'));
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-background shadow-xl rounded-lg border border-gold">
      <div className="flex flex-col items-center">
        {/* Ícone representando o gift card */}
        <FaGift className="text-6xl text-gold mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-foreground">
          {t('title')}
        </h2>
        <div className="w-1/2">
          <SparklesHero />
        </div>
        <p className="text-foreground text-center mb-6">
          {t('description')}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={handlePurchase}
          className="mx-auto mr-2 ml-2 w-full py-3 px-6 bg-gold text-background font-semibold rounded flex items-center justify-center hover:bg-opacity-90 hover:scale-105 transitions duration-300"
        >
          {t('buttonText')}
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default GiftCardPurchase;

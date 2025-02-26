'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  useSearchParams,
  useRouter,
} from 'next/navigation';
import { gsap } from 'gsap';
import { FaGift } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';

import {
  FiDownload,
  FiHome,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiDollarSign,
  FiCreditCard,
} from 'react-icons/fi';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';

interface GiftCardData {
  sessionId: string;
  name: string;
  phone?: string;
  message?: string;
  amount: number; // cents
  stripePaymentId?: string | null;
}

export default function SuccessPage() {
  const t = useTranslations('GiftCardSuccess');
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [saved, setSaved] = useState<boolean>(false);
  const [giftCard, setGiftCard] =
    useState<GiftCardData | null>(null);
  const [error, setError] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const [confetti, setConfetti] = useState<boolean>(false);

  useEffect(() => {
    const updatePaymentAndFetchData = async () => {
      if (!sessionId) return;

      const resPost = await fetch('/api/save-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const postData = await resPost.json();
      if (!resPost.ok) {
        setError(
          postData.error || 'Failed to save payment data.'
        );
        return;
      }
      setSaved(true);

      const resGet = await fetch(
        `/api/get-giftcard?sessionId=${sessionId}`
      );
      const getData = await resGet.json();
      if (resGet.ok) {
        setGiftCard(getData);
        setConfetti(true);
      } else {
        setError(
          getData.error ||
            'Failed to retrieve gift card data.'
        );
      }
    };

    updatePaymentAndFetchData();
  }, [sessionId]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `giftcard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useGSAP(() => {
    if (giftCard && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }
  }, [giftCard]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-black to-gray-900 text-white">
      {confetti && (
        <Confetti numberOfPieces={200} recycle={false} />
      )}
      <h1 className="text-2xl md:text-4xl font-extrabold text-gold drop-shadow-lg mb-4">
        {t('successTitle')}
      </h1>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {!saved && !error && (
        <p className="mt-4">
          {t('registeringPaymentData')}
        </p>
      )}
      {saved && !giftCard && !error && (
        <p className="mt-4">{t('paymentSaved')}</p>
      )}
      {giftCard && (
        <>
          <div
            ref={cardRef}
            className="max-w-md w-full p-6 bg-gradient-to-br from-gray-900 to-black border-4 border-gold rounded-lg shadow-2xl mt-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70"></div>
            <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-gold to-transparent opacity-70"></div>
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-gold to-transparent opacity-70"></div>

            <div className="flex flex-col items-center mb-6 pb-4 border-b border-gold/30">
              <div className="bg-gold/10 p-3 rounded-full mb-2">
                <FaGift className="text-5xl text-gold animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-gold">
                {t('giftCardHeading')}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gold/5 rounded-lg border border-gold/20">
                <FiUser className="text-gold mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gold/70 uppercase font-semibold">
                    {t('nameLabel')}
                  </p>
                  <p className="text-lg font-medium">
                    {giftCard.name}
                  </p>
                </div>
              </div>

              {giftCard.phone && (
                <div className="flex items-center p-3 bg-gold/5 rounded-lg border border-gold/20">
                  <FiPhone className="text-gold mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gold/70 uppercase font-semibold">
                      {t('phoneLabel')}
                    </p>
                    <p className="text-lg font-medium">
                      {giftCard.phone}
                    </p>
                  </div>
                </div>
              )}

              {giftCard.message && (
                <div className="flex p-3 bg-gold/5 rounded-lg border border-gold/20">
                  <FiMessageSquare className="text-gold mr-3 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gold/70 uppercase font-semibold">
                      {t('messageLabel')}
                    </p>
                    <p className="text-lg font-medium">
                      {giftCard.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-3 bg-gold/10 rounded-lg border border-gold/30">
                <FiDollarSign className="text-gold mr-3 flex-shrink-0 text-xl" />
                <div className="flex-1">
                  <p className="text-xs text-gold/70 uppercase font-semibold">
                    {t('amountLabel')}
                  </p>
                  <p className="text-2xl font-bold text-gold">
                    ${(giftCard.amount / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              {giftCard.stripePaymentId && (
                <div className="flex items-center p-3 bg-gold/5 rounded-lg border border-gold/20">
                  <FiCreditCard className="text-gold/70 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gold/70 uppercase font-semibold">
                      {t('paymentId')}
                    </p>
                    <p className="text-sm font-medium text-gray-400 truncate">
                      {giftCard.stripePaymentId}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gold/30 text-center">
              <p className="text-lg font-medium text-gold">
                ✨ {t('flaviaguedesUse')} ✨
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-gold text-black px-6 py-3 rounded-md font-semibold shadow-lg hover:scale-105 transition-all"
              aria-label="Download gift card"
            >
              <FiDownload /> {t('downloadCard')}
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:scale-105 transition-all"
              aria-label="Return to home page"
            >
              <FiHome /> {t('backHome')}
            </button>
          </div>
        </>
      )}
      <p className="mt-6 text-lg text-gray-300">
        {t('thankYouMessage')}
      </p>
    </div>
  );
}

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

import { FiDownload, FiHome } from 'react-icons/fi';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';

interface GiftCardData {
  sessionId: string;
  name: string;
  giftName?: string;
  phone?: string;
  message?: string;
  amount: number; // em centavos
  stripePaymentId?: string | null;
}

export default function SuccessPage() {
  const t = useTranslations('GiftCardSuccess');
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');
  const paymentType = searchParams.get('type');

  const [saved, setSaved] = useState<boolean>(false);
  const [giftCard, setGiftCard] =
    useState<GiftCardData | null>(null);
  const [error, setError] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const [confetti, setConfetti] = useState<boolean>(false);

  useEffect(() => {
    const updatePaymentAndFetchData = async () => {
      // Handle Square payments
      if (paymentType === 'square' && paymentId) {
        const resGet = await fetch(
          `/api/get-square-payment?paymentId=${paymentId}`
        );
        const getData = await resGet.json();
        if (resGet.ok) {
          setGiftCard(getData);
          setConfetti(true);
          setSaved(true);
        } else {
          setError(
            getData.error ||
              'Failed to retrieve gift card data.'
          );
        }
        return;
      }

      // Handle Stripe payments (legacy)
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
  }, [sessionId, paymentId, paymentType]);

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
            className="max-w-md w-full rounded-2xl bg-gradient-to-br from-gold via-yellow-700 to-gold p-[2px] shadow-2xl mt-4"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-graphite via-black to-graphite px-8 py-10 text-center">
              {/* Brilho dourado no topo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(380px circle at 50% 0%, rgba(200,160,75,0.14), transparent 70%)',
                }}
              />

              <div className="relative">
                {/* Marca */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/flavia-logo-gold.png"
                  alt="Flavia Guedes"
                  className="mx-auto h-14 w-auto"
                />
                <p className="mt-3 text-[11px] uppercase tracking-[0.4em] text-gold/70">
                  {t('giftCardHeading')}
                </p>

                {/* Divisor com presente */}
                <div className="my-7 flex items-center justify-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
                  <FaGift className="text-xl text-gold" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
                </div>

                {/* Valor */}
                <p className="font-display text-6xl font-semibold text-gold leading-none">
                  ${(giftCard.amount / 100).toFixed(2)}
                </p>

                {/* Mensagem do presente */}
                {giftCard.message && (
                  <p className="mt-7 font-display italic text-xl text-gray-200 leading-relaxed">
                    &ldquo;{giftCard.message}&rdquo;
                  </p>
                )}

                {/* De / Para */}
                <div className="mt-8 flex items-stretch justify-center gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">
                      {t('nameLabel')}
                    </p>
                    <p className="mt-1 font-medium text-white">
                      {giftCard.name}
                    </p>
                  </div>
                  {giftCard.giftName && (
                    <>
                      <div className="w-px bg-gold/25" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">
                          {t('giftNameLabel') || 'Para'}
                        </p>
                        <p className="mt-1 font-medium text-white">
                          {giftCard.giftName}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Rodapé do cartão */}
                <div className="mt-9 border-t border-gold/20 pt-5">
                  <p className="text-sm text-gold/90">
                    ✨ {t('flaviaguedesUse')} ✨
                  </p>
                  {giftCard.phone && (
                    <p className="mt-3 text-[10px] tracking-wide text-gray-500">
                      {t('phoneLabel')}: {giftCard.phone}
                    </p>
                  )}
                  {giftCard.stripePaymentId && (
                    <p className="mt-1 text-[10px] tracking-wide text-gray-600 truncate">
                      {t('paymentId')}:{' '}
                      {giftCard.stripePaymentId}
                    </p>
                  )}
                </div>
              </div>
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

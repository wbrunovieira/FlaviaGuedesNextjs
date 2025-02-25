'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { FaGift } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';

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
  const sessionId = searchParams.get('session_id');

  const [saved, setSaved] = useState<boolean>(false);
  const [giftCard, setGiftCard] =
    useState<GiftCardData | null>(null);
  const [error, setError] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

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
      } else {
        setError(
          getData.error ||
            'Failed to retrieve gift card data.'
        );
      }
    };

    updatePaymentAndFetchData();
  }, [sessionId]);

  useGSAP(() => {
    if (giftCard && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }
  }, [giftCard]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0A0A0A] text-[#EDEDED]">
      <h1 className="text-3xl font-bold mb-4">
        {t('successTitle')}
      </h1>
      {sessionId && (
        <p className="mb-2">
          {t('sessionLabel')}: {sessionId}
        </p>
      )}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {!saved && !error && (
        <p className="mt-4">
          {t('registeringPaymentData')}
        </p>
      )}
      {saved && !giftCard && !error && (
        <p className="mt-4">{t('paymentSaved')} </p>
      )}
      {giftCard && (
        <div
          ref={cardRef}
          className="max-w-md w-full p-6 bg-[#0A0A0A] border-4 border-[#C8A04B] rounded-lg shadow-lg mt-4"
        >
          <div className="flex items-center mb-4">
            <FaGift className="text-4xl text-[#C8A04B] mr-2" />
            <h2 className="text-2xl font-bold">
              {t('giftCardHeading')}
            </h2>
          </div>
          <p className="mb-2">
            <span className="font-semibold">
              {t('nameLabel')}:
            </span>{' '}
            {giftCard.name}
          </p>
          {giftCard.phone && (
            <p className="mb-2">
              <span className="font-semibold">
                {t('phoneLabel')}:
              </span>{' '}
              {giftCard.phone}
            </p>
          )}
          {giftCard.message && (
            <p className="mb-2">
              <span className="font-semibold">
                {t('messageLabel')}:
              </span>{' '}
              {giftCard.message}
            </p>
          )}
          <p className="mb-2">
            <span className="font-semibold">
              {t('amountLabel')}:
            </span>{' '}
            ${(giftCard.amount / 100).toFixed(2)}
          </p>
          {giftCard.stripePaymentId && (
            <p className="mb-2 text-sm">
              <span className="font-semibold">
                Payment ID:
              </span>{' '}
              {giftCard.stripePaymentId}
            </p>
          )}
          <p className="mt-4 text-center">
            {t('useInstruction')}
          </p>
        </div>
      )}
      <p className="mt-6">{t('thankYouMessage')}</p>
    </div>
  );
}

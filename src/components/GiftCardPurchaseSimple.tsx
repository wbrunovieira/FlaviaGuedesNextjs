'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { FaGift, FaArrowRight } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import Script from 'next/script';
import type { SquarePaymentsInstance, SquareCard } from '@/types/square';

type GiftCardPurchaseProps = {
  id?: string;
};

export default function GiftCardPurchaseSimple({
  id = 'giftcard',
}: GiftCardPurchaseProps) {
  const t = useTranslations('GiftCard');
  const locale = useLocale();
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [giftName, setGiftName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [card, setCard] = useState<SquareCard | null>(null);
  const [payments, setPayments] = useState<SquarePaymentsInstance | null>(null);

  // Determine environment
  const isProduction = process.env.NODE_ENV === 'production';
  const applicationId = isProduction
    ? process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID;

  useEffect(() => {
    if (!showInput) return;
    if (payments || card) return; // Already initialized

    const initializeSquare = async () => {
      // Wait for Square to load
      let attempts = 0;
      while (!window.Square && attempts < 20) {
        console.log('[DEBUG] Waiting for Square SDK to load...');
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!window.Square) {
        console.error('[ERROR] Square SDK failed to load');
        setError('Payment system failed to load. Please refresh the page.');
        return;
      }

      try {
        console.log('[DEBUG] Initializing Square payments with App ID:', applicationId);
        const paymentsInstance = window.Square.payments(applicationId!);
        setPayments(paymentsInstance);

        console.log('[DEBUG] Creating card instance...');
        const cardInstance = await paymentsInstance.card();

        console.log('[DEBUG] Attaching card to container...');
        await cardInstance.attach('#card-container');
        setCard(cardInstance);

        console.log('[DEBUG] Square card initialized successfully');
      } catch (e) {
        console.error('[ERROR] Square initialization error:', e);
        setError('Payment system initialization failed: ' + (e as Error).message);
      }
    };

    initializeSquare();
  }, [showInput, applicationId, card, payments]);

  const handlePayment = async () => {
    if (!card) {
      setError('Payment method not ready');
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(t('invalidAmount') || 'Please enter a valid amount greater than zero.');
      return;
    }

    if (numericAmount < 25) {
      setError(t('minAmount') || 'Minimum amount is $25.');
      return;
    }

    if (!name.trim()) {
      setError(t('invalidName') || 'Please enter your name.');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        const amountInCents = Math.round(numericAmount * 100);

        const response = await fetch('/api/create-square-payment-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInCents,
            locale,
            name,
            giftName,
            phone,
            message,
            sourceId: result.token,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          window.location.href = `/${locale}/success?payment_id=${data.paymentId}&type=square`;
        } else {
          setError(data.error || t('purchaseFailure') || 'Payment failed');
        }
      } else {
        setError('Card validation failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(t('purchaseFailure') || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (error) setError('');
  };

  return (
    <>
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        strategy="lazyOnload"
      />

      <div
        id={id}
        className="max-w-xl mx-auto p-8 bg-background shadow-xl rounded-lg border border-gold"
      >
        <div className="flex flex-col items-center">
          <FaGift className="text-6xl text-gold mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-foreground">
            {t('title')}
          </h2>
          <p className="text-foreground text-center mb-6">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {showInput && (
            <>
              <input
                type="number"
                placeholder={t('inputPlaceholder') || 'Enter amount in USD'}
                value={amount}
                onChange={handleInputChange}
                className="p-2 border rounded text-background"
                min="25"
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder={t('namePlaceholder') || 'Your name'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="p-2 border rounded text-background"
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder={t('namegiftPlaceholder') || 'For whom?'}
                value={giftName}
                onChange={e => setGiftName(e.target.value)}
                className="p-2 border rounded text-background"
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder={t('phonePlaceholder') || 'Your phone (optional)'}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="p-2 border rounded text-background"
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder={t('messagePlaceholder') || 'Custom message (optional)'}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="p-2 border rounded text-background"
                disabled={isProcessing}
              />

              {/* Square Card Container */}
              <div id="card-container" className="min-h-[90px] border border-gray-300 rounded p-2">
                {!card && (
                  <div className="text-gray-500 text-sm">
                    Loading payment form...
                  </div>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !card}
                className="w-full py-3 px-6 bg-gold text-background font-semibold rounded flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
              >
                {isProcessing ? (
                  t('processing') || 'Processing...'
                ) : (
                  <>
                    {t('confirmPurchase') || 'Confirm Purchase'}
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className="w-full py-3 px-6 bg-gold text-background font-semibold rounded flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300"
            >
              {t('buttonText') || 'Purchase Gift Card'}
              <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
'use client';

import React, { useState, ChangeEvent } from 'react';
import { FaGift, FaArrowRight } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import {
  PaymentForm,
  CreditCard,
} from 'react-square-web-payments-sdk';

type GiftCardPurchaseShowcaseProps = {
  id?: string;
};

export default function GiftCardPurchaseSquare({
  id = 'giftcard',
}: GiftCardPurchaseShowcaseProps) {
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

  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === 'production';

  // Use appropriate Square Application ID
  const applicationId = isProduction
    ? process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || ''
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID || '';

  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';

  const handlePaymentSuccess = async (token: any) => {
    setIsProcessing(true);
    setError('');

    try {
      const numericAmount = Number(amount);
      const amountInCents = Math.round(numericAmount * 100);

      const response = await fetch('/api/create-square-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          locale,
          name,
          giftName,
          phone,
          message,
          sourceId: token.token,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to success page with payment ID
        window.location.href = `/${locale}/success?payment_id=${data.paymentId}&type=square`;
      } else {
        setError(data.error || t('purchaseFailure') || 'Payment failed');
      }
    } catch (err) {
      setError(t('purchaseFailure') || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  const validateInputs = () => {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(
        t('invalidAmount') ||
        'Please enter a valid amount greater than zero.'
      );
      return false;
    }

    if (numericAmount < 25) {
      setError(
        t('minAmount') || 'Minimum amount is $25.'
      );
      return false;
    }

    if (!name.trim()) {
      setError(
        t('invalidName') || 'Please enter your name.'
      );
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (error) setError('');
  };

  return (
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

            {/* Square Payment Form */}
            {validateInputs() && applicationId && (
              <div className="mt-4 p-4 border border-gold rounded">
                <PaymentForm
                  applicationId={applicationId}
                  locationId={locationId}
                  cardTokenizeResponseReceived={handlePaymentSuccess}
                  createPaymentRequest={() => ({
                    countryCode: 'US',
                    currencyCode: 'USD',
                    total: {
                      amount: (Number(amount) * 100).toString(),
                      label: 'Gift Card',
                    },
                  })}
                >
                  <CreditCard
                    buttonProps={{
                      css: {
                        backgroundColor: '#C8A04B',
                        color: '#0A0A0A',
                        fontSize: '16px',
                        fontWeight: '600',
                        '&:hover': {
                          backgroundColor: '#B89040',
                        },
                      },
                    }}
                  />
                </PaymentForm>
              </div>
            )}
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
            disabled={isProcessing}
          >
            {t('buttonText') || 'Purchase Gift Card'}
            <FaArrowRight className="ml-2" />
          </button>
        )}

        {isProcessing && (
          <div className="text-center text-gold">
            {t('processing') || 'Processing payment...'}
          </div>
        )}
      </div>
    </div>
  );
}
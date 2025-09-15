'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { FaGift, FaArrowRight, FaCreditCard, FaApple, FaGoogle, FaMobileAlt } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import Script from 'next/script';

declare global {
  interface Window {
    Square: any;
  }
}

type GiftCardPurchaseProps = {
  id?: string;
};

export default function GiftCardPurchaseMultiPayment({
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
  const [payments, setPayments] = useState<any>(null);

  // Payment methods
  const [card, setCard] = useState<any>(null);
  const [applePay, setApplePay] = useState<any>(null);
  const [googlePay, setGooglePay] = useState<any>(null);
  const [cashApp, setCashApp] = useState<any>(null);

  // Available payment methods
  const [availableMethods, setAvailableMethods] = useState({
    card: false,
    applePay: false,
    googlePay: false,
    cashApp: false,
  });

  // Determine environment
  const isProduction = process.env.NODE_ENV === 'production';
  const applicationId = isProduction
    ? process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID;

  // In sandbox, show all payment methods for testing
  const isSandbox = !isProduction;

  useEffect(() => {
    if (!showInput) return;
    if (payments) return;

    const initializeSquare = async () => {
      console.log('[DEBUG] Starting Square initialization...');
      console.log('[DEBUG] Environment:', isProduction ? 'Production' : 'Sandbox');
      console.log('[DEBUG] Application ID:', applicationId);
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
        const paymentsInstance = window.Square.payments(applicationId);
        setPayments(paymentsInstance);

        // Initialize Card
        try {
          const cardInstance = await paymentsInstance.card();
          await cardInstance.attach('#card-container');
          setCard(cardInstance);
          setAvailableMethods(prev => ({ ...prev, card: true }));
          console.log('[DEBUG] Card payment initialized');
        } catch (e) {
          console.log('[DEBUG] Card not available:', e);
        }

        // Initialize Apple Pay
        try {
          const paymentRequest = paymentsInstance.paymentRequest({
            countryCode: 'US',
            currencyCode: 'USD',
            total: {
              amount: (Number(amount || 25) * 100).toString(),
              label: 'Gift Card',
            },
          });

          const applePayInstance = await paymentsInstance.applePay(paymentRequest);
          setApplePay(applePayInstance);
          setAvailableMethods(prev => ({ ...prev, applePay: true }));
          console.log('[DEBUG] Apple Pay initialized');
        } catch (e) {
          console.error('[DEBUG] Apple Pay error details:', e);
          // Always show in sandbox for testing
          if (isSandbox) {
            setAvailableMethods(prev => ({ ...prev, applePay: true }));
            console.log('[DEBUG] Force showing Apple Pay in sandbox mode');
          }
        }

        // Initialize Google Pay
        try {
          const paymentRequest = paymentsInstance.paymentRequest({
            countryCode: 'US',
            currencyCode: 'USD',
            total: {
              amount: (Number(amount || 25) * 100).toString(),
              label: 'Gift Card',
            },
          });

          const googlePayInstance = await paymentsInstance.googlePay(paymentRequest);
          await googlePayInstance.attach('#google-pay-button');
          setGooglePay(googlePayInstance);
          setAvailableMethods(prev => ({ ...prev, googlePay: true }));
          console.log('[DEBUG] Google Pay initialized');
        } catch (e) {
          console.error('[DEBUG] Google Pay error details:', e);
          // Always show in sandbox for testing
          if (isSandbox) {
            setAvailableMethods(prev => ({ ...prev, googlePay: true }));
            console.log('[DEBUG] Force showing Google Pay in sandbox mode');
          }
        }

        // Initialize Cash App Pay
        try {
          const cashAppInstance = await paymentsInstance.cashAppPay({
            redirectURL: window.location.origin,
            referenceId: `gift-card-${Date.now()}`,
          });
          setCashApp(cashAppInstance);
          setAvailableMethods(prev => ({ ...prev, cashApp: true }));
          console.log('[DEBUG] Cash App Pay initialized');
        } catch (e) {
          console.error('[DEBUG] Cash App Pay error details:', e);
          // Always show in sandbox for testing
          if (isSandbox) {
            setAvailableMethods(prev => ({ ...prev, cashApp: true }));
            console.log('[DEBUG] Force showing Cash App Pay in sandbox mode');
          }
        }

      } catch (e) {
        console.error('[ERROR] Square initialization error:', e);
        setError('Payment system initialization failed: ' + (e as any).message);
      }
    };

    initializeSquare();
  }, [showInput]); // Remove amount dependency to avoid re-initialization

  const processPayment = async (token: string) => {
    const numericAmount = Number(amount);
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
        sourceId: token,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      window.location.href = `/${locale}/success?payment_id=${data.paymentId}&type=square`;
    } else {
      throw new Error(data.error || 'Payment failed');
    }
  };

  const handleCardPayment = async () => {
    if (!card) {
      setError('Card payment not ready');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        await processPayment(result.token);
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

  const handleApplePayment = async () => {
    if (!applePay && !isSandbox) return;

    setIsProcessing(true);
    setError('');

    try {
      if (isSandbox && !applePay) {
        // Demo mode - show message
        setError('Apple Pay is not available in sandbox mode on this device. In production, Apple Pay will work on supported devices.');
        setTimeout(() => setError(''), 5000);
        return;
      }
      const result = await applePay.tokenize();
      if (result.status === 'OK') {
        await processPayment(result.token);
      } else {
        setError('Apple Pay failed');
      }
    } catch (err) {
      console.error('Apple Pay error:', err);
      setError('Apple Pay processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGooglePayment = async () => {
    if (!googlePay && !isSandbox) return;

    setIsProcessing(true);
    setError('');

    try {
      if (isSandbox && !googlePay) {
        // Demo mode - show message
        setError('Google Pay is not available in sandbox mode on this device. In production, Google Pay will work on supported devices.');
        setTimeout(() => setError(''), 5000);
        return;
      }
      const result = await googlePay.tokenize();
      if (result.status === 'OK') {
        await processPayment(result.token);
      } else {
        setError('Google Pay failed');
      }
    } catch (err) {
      console.error('Google Pay error:', err);
      setError('Google Pay processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashAppPayment = async () => {
    if (!cashApp && !isSandbox) return;

    setIsProcessing(true);
    setError('');

    try {
      if (isSandbox && !cashApp) {
        // Demo mode - show message
        setError('Cash App Pay is not available in sandbox mode. In production, Cash App Pay will work for users with the Cash App installed.');
        setTimeout(() => setError(''), 5000);
        return;
      }
      const result = await cashApp.tokenize();
      if (result.status === 'OK') {
        await processPayment(result.token);
      } else {
        setError('Cash App Pay failed');
      }
    } catch (err) {
      console.error('Cash App Pay error:', err);
      setError('Cash App Pay processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  const validateInputs = () => {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(t('invalidAmount') || 'Please enter a valid amount greater than zero.');
      return false;
    }

    if (numericAmount < 25) {
      setError(t('minAmount') || 'Minimum amount is $25.');
      return false;
    }

    if (!name.trim()) {
      setError(t('invalidName') || 'Please enter your name.');
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

              {/* Payment Methods Section */}
              {validateInputs() && (
                <div className="border border-gold rounded p-4">
                  <h3 className="text-lg font-semibold text-gold mb-4">
                    Choose Payment Method:
                  </h3>

                  {/* Card Payment */}
                  {availableMethods.card && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <FaCreditCard className="text-gold mr-2" />
                        <span className="text-foreground">Credit/Debit Card</span>
                      </div>
                      <div id="card-container" className="min-h-[90px] border border-gray-300 rounded p-2 mb-2"></div>
                      <button
                        onClick={handleCardPayment}
                        disabled={isProcessing || !card}
                        className="w-full py-2 px-4 bg-gold text-background font-semibold rounded hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                      >
                        Pay with Card
                      </button>
                    </div>
                  )}

                  {/* Apple Pay */}
                  {availableMethods.applePay && (
                    <div className="mb-4">
                      <button
                        onClick={handleApplePayment}
                        disabled={isProcessing || (!applePay && !isSandbox)}
                        className="w-full py-3 px-4 bg-black text-white font-semibold rounded flex items-center justify-center hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50"
                      >
                        <FaApple className="mr-2" />
                        Apple Pay {isSandbox && !applePay ? '(Demo)' : ''}
                      </button>
                    </div>
                  )}

                  {/* Google Pay */}
                  {availableMethods.googlePay && (
                    <div className="mb-4">
                      {googlePay ? (
                        <div id="google-pay-button"></div>
                      ) : (
                        <button
                          onClick={handleGooglePayment}
                          disabled={isProcessing || (!googlePay && !isSandbox)}
                          className="w-full py-3 px-4 bg-white text-gray-800 border border-gray-300 font-semibold rounded flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50"
                        >
                          <FaGoogle className="mr-2 text-blue-500" />
                          Google Pay {isSandbox && !googlePay ? '(Demo)' : ''}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cash App Pay */}
                  {availableMethods.cashApp && (
                    <div className="mb-4">
                      <button
                        onClick={handleCashAppPayment}
                        disabled={isProcessing || (!cashApp && !isSandbox)}
                        className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded flex items-center justify-center hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                      >
                        <FaMobileAlt className="mr-2" />
                        Cash App Pay {isSandbox && !cashApp ? '(Demo)' : ''}
                      </button>
                    </div>
                  )}
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
    </>
  );
}
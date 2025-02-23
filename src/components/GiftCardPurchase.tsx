'use client';

import React, { useState, ChangeEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FaGift, FaArrowRight } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const GiftCardPurchase: React.FC = () => {
  const t = useTranslations('GiftCard');
  const locale = useLocale();
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showInput, setShowInput] =
    useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleConfirmPurchase = async () => {
    // Validação: valor numérico e maior que zero
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(
        t('invalidAmount') ||
          'Por favor, insira um valor válido maior que zero.'
      );
      return;
    }
    // Validação: nome é obrigatório para personalização
    if (!name.trim()) {
      setError(
        t('invalidName') || 'Por favor, insira seu nome.'
      );
      return;
    }
    setError('');

    // Converte o valor para centavos
    const amountInCents = Math.round(numericAmount * 100);

    // Envia os dados para a API de criação da sessão
    const response = await fetch(
      '/api/create-checkout-session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          locale,
          name,
          phone,
          message,
        }),
      }
    );

    const data = await response.json();

    if (data.sessionId) {
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (result?.error) {
        alert(result.error.message);
      }
    } else {
      alert(t('purchaseFailure'));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-background shadow-xl rounded-lg border border-gold">
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
              placeholder={
                t('inputPlaceholder') ||
                'Digite o valor em USD'
              }
              value={amount}
              onChange={handleInputChange}
              className="p-2 border rounded text-background"
              min="0"
            />
            <input
              type="text"
              placeholder={
                t('namePlaceholder') || 'Seu nome'
              }
              value={name}
              onChange={e => setName(e.target.value)}
              className="p-2 border rounded text-background"
            />
            <input
              type="text"
              placeholder={
                t('phonePlaceholder') ||
                'Seu telefone (opcional)'
              }
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="p-2 border rounded text-background"
            />
            <input
              type="text"
              placeholder={
                t('messagePlaceholder') ||
                'Mensagem personalizada (opcional)'
              }
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="p-2 border rounded text-background"
            />
          </>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}
        <button
          onClick={() => {
            if (!showInput) {
              setShowInput(true);
            } else {
              handleConfirmPurchase();
            }
          }}
          className="w-full py-3 px-6 bg-gold text-background font-semibold rounded flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300"
        >
          {showInput
            ? t('confirmPurchase') || 'Confirmar Compra'
            : t('buttonText')}
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default GiftCardPurchase;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Script from 'next/script';
import {
  FaCheck,
  FaCrown,
  FaArrowRight,
  FaArrowDown,
} from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import type {
  SquarePaymentsInstance,
  SquareCard,
} from '@/types/square';
import { BEAUTY_BANK_TIERS } from '@/lib/beauty-bank-tiers';

type BeautyBankPurchaseProps = {
  id?: string;
};

export default function BeautyBankPurchase({
  id = 'beauty-bank',
}: BeautyBankPurchaseProps) {
  const t = useTranslations('BeautyBank');
  const locale = useLocale();

  const [selectedTier, setSelectedTier] = useState<
    string | null
  >(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [purchasedCredit, setPurchasedCredit] =
    useState<number | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<SquareCard | null>(null);
  const [payments, setPayments] =
    useState<SquarePaymentsInstance | null>(null);

  const isProduction =
    process.env.NODE_ENV === 'production';
  const applicationId = isProduction
    ? process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID;

  const terms = t.raw('terms') as string[];

  useEffect(() => {
    if (!selectedTier || payments || card) return;

    const init = async () => {
      let attempts = 0;
      while (!window.Square && attempts < 20) {
        await new Promise(r => setTimeout(r, 500));
        attempts++;
      }
      if (!window.Square) {
        setError('Payment system failed to load. Please refresh.');
        return;
      }
      try {
        const instance = window.Square.payments(applicationId!);
        setPayments(instance);
        const cardInstance = await instance.card();
        await cardInstance.attach('#beauty-bank-card');
        setCard(cardInstance);
      } catch (e) {
        setError(
          'Payment init failed: ' + (e as Error).message
        );
      }
    };
    init();
  }, [selectedTier, applicationId, card, payments]);

  const handlePay = async () => {
    if (!card || !selectedTier) return;
    if (!name.trim()) {
      setError(t('invalidName'));
      return;
    }
    setError('');
    setIsProcessing(true);
    try {
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        setError('Card validation failed');
        setIsProcessing(false);
        return;
      }
      const response = await fetch('/api/create-beauty-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          name,
          phone,
          email,
          sourceId: result.token,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPurchasedCredit(data.credit ?? null);
        setDone(true);
      } else {
        setError(data.error || t('purchaseFailure'));
      }
    } catch {
      setError(t('purchaseFailure'));
    } finally {
      setIsProcessing(false);
    }
  };

  const usd = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US')}`;

  const handleDownloadCert = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: '#000000',
    });
    const link = document.createElement('a');
    link.download = `beauty-bank-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const tierForCert = selectedTier
    ? BEAUTY_BANK_TIERS.find(x => x.id === selectedTier)
    : null;

  return (
    <section
      id={id}
      className="relative mx-auto max-w-5xl px-6 py-16"
    >
      <Script
        src={
          isProduction
            ? 'https://web.squarecdn.com/v1/square.js'
            : 'https://sandbox.web.squarecdn.com/v1/square.js'
        }
        strategy="lazyOnload"
      />

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <FaCrown className="text-2xl" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t('title')}
        </h2>
        <p className="mt-2 font-display text-xl italic text-gold">
          {t('tagline')}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-grayMedium">
          {t('description')}
        </p>
      </div>

      {done ? (
        <div className="mx-auto mt-10 max-w-md text-center">
          <h3 className="font-display text-2xl text-gold">
            {t('successTitle')}
          </h3>
          <p className="mt-2 text-sm text-grayMedium">
            {t('successText')}
          </p>

          {/* Certificado para download */}
          <div
            ref={certRef}
            className="mx-auto mt-6 rounded-2xl bg-gradient-to-br from-gold via-yellow-700 to-gold p-[2px] shadow-2xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-graphite via-black to-graphite px-8 py-10">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(380px circle at 50% 0%, rgba(200,160,75,0.16), transparent 70%)',
                }}
              />
              <div className="relative text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/flavia-logo-gold.png"
                  alt="Flavia Guedes"
                  className="mx-auto h-12 w-auto"
                />
                <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-gold/70">
                  {t('title')}
                </p>

                <div className="my-6 flex items-center justify-center gap-3">
                  <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
                  <FaCrown className="text-gold" />
                  <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
                </div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">
                  {t('certCreditLabel')}
                </p>
                <p className="mt-1 font-display text-6xl font-bold leading-none text-gold">
                  {purchasedCredit
                    ? usd(purchasedCredit)
                    : ''}
                </p>
                {tierForCert && (
                  <p className="mt-3 text-xs text-grayMedium">
                    {t('certDeposited')} {usd(tierForCert.deposit)}
                    {' · '}+
                    {usd(
                      tierForCert.credit - tierForCert.deposit
                    )}{' '}
                    {t('bonus')}
                  </p>
                )}

                <div className="mt-7 border-t border-gold/20 pt-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">
                    {t('certHolder')}
                  </p>
                  <p className="mt-1 font-medium text-white">
                    {name}
                  </p>
                  <p className="mt-4 text-xs text-gold/90">
                    ✦ {t('certNoExpiration')} ✦
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadCert}
            className="mx-auto mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-background shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-opacity-90"
          >
            <FiDownload />
            {t('downloadCertificate')}
          </button>
        </div>
      ) : !selectedTier ? (
        <>
          {/* Tier cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BEAUTY_BANK_TIERS.map(tier => {
              const extra = tier.credit - tier.deposit;
              const bonus = Math.round(
                (extra / tier.deposit) * 100
              );
              return (
                <div
                  key={tier.id}
                  className="group flex flex-col rounded-xl border border-gold/20 bg-gradient-to-b from-graphite to-black/60 p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_50px_-20px_rgba(200,160,75,0.3)]"
                >
                  {/* Você paga */}
                  <p className="text-[10px] uppercase tracking-[0.22em] text-grayMedium">
                    {t('deposit')}
                  </p>
                  <p className="mt-1 text-2xl font-medium text-grayMedium">
                    {usd(tier.deposit)}
                  </p>

                  {/* Transformação */}
                  <FaArrowDown className="mx-auto my-3 text-sm text-gold/60" />

                  {/* Crédito para usar (destaque) */}
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70">
                    {t('youReceive')}
                  </p>
                  <p className="mt-1 font-display text-5xl font-bold leading-none text-gold">
                    {usd(tier.credit)}
                  </p>

                  {/* Bônus em dólar + % */}
                  <span className="mx-auto mt-3 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
                    +{usd(extra)} {t('bonus')} · {bonus}%
                  </span>

                  <button
                    onClick={() => {
                      setSelectedTier(tier.id);
                      setError('');
                    }}
                    className="mt-5 w-full rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-background transition-all duration-300 hover:bg-opacity-90"
                  >
                    {t('select')}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Terms */}
          <div className="mx-auto mt-10 max-w-2xl">
            <p className="text-center text-[11px] uppercase tracking-[0.3em] text-gold/60">
              {t('termsTitle')}
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {terms.map((term, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-grayMedium"
                >
                  <FaCheck className="text-[9px] text-gold" />
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        /* Payment form for selected tier */
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gold/30 bg-gradient-to-b from-graphite to-black/60 p-6 md:p-8">
          {(() => {
            const tier = BEAUTY_BANK_TIERS.find(
              x => x.id === selectedTier
            )!;
            const bonus = Math.round(
              ((tier.credit - tier.deposit) /
                tier.deposit) *
                100
            );
            return (
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60">
                  {t('selectedPackage')}
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-gold">
                  {usd(tier.deposit)} → {usd(tier.credit)}
                </p>
                <p className="text-xs text-grayMedium">
                  +{bonus}% {t('bonus')}
                </p>
                <button
                  onClick={() => {
                    setSelectedTier(null);
                    setCard(null);
                    setPayments(null);
                  }}
                  className="mt-2 text-xs text-gold/70 underline transition-colors hover:text-gold"
                >
                  {t('changePackage')}
                </button>
              </div>
            );
          })()}

          <div className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded border bg-background p-2 text-white placeholder-grayMedium"
              disabled={isProcessing}
            />
            <input
              type="tel"
              placeholder={t('phonePlaceholder')}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="rounded border bg-background p-2 text-white placeholder-grayMedium"
              disabled={isProcessing}
            />
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded border bg-background p-2 text-white placeholder-grayMedium"
              disabled={isProcessing}
            />

            <div
              id="beauty-bank-card"
              className="min-h-[90px] rounded border border-gray-600 p-2"
            >
              {!card && (
                <div className="text-sm text-grayMedium">
                  {t('loadingForm')}
                </div>
              )}
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing || !card}
              className="flex w-full items-center justify-center gap-2 rounded bg-gold px-6 py-3 font-semibold text-background transition-colors duration-300 hover:bg-opacity-90 disabled:opacity-50"
            >
              {isProcessing ? (
                t('processing')
              ) : (
                <>
                  {t('payButton')}
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-grayMedium">
              {t('policyNote')}{' '}
              <Link
                href={`/${locale}/policies`}
                className="text-gold/80 underline transition-colors hover:text-gold"
              >
                {t('policyLink')}
              </Link>
            </p>

            {error && (
              <p className="text-center text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

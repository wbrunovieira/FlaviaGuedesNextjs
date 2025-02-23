'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CancelPage() {
  const t = useTranslations('GiftCard');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [cancelledSaved, setCancelledSaved] =
    useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const saveCancellation = async () => {
      if (sessionId) {
        const resPost = await fetch('/api/save-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({
            sessionId,
            cancelled: true,
          }),
        });
        const data = await resPost.json();
        if (resPost.ok) {
          setCancelledSaved(true);
        } else {
          setError(
            data.error ||
              'Falha ao registrar o cancelamento.'
          );
        }
      }
    };
    saveCancellation();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0A0A0A] text-[#EDEDED]">
      <h1 className="text-3xl font-bold mb-4">
        {t('cancelTitle') || 'Pagamento Cancelado'}
      </h1>
      {sessionId && (
        <p className="mb-2">
          {t('sessionLabel') || 'ID da Sessão'}: {sessionId}
        </p>
      )}
      {cancelledSaved ? (
        <p className="mb-2">
          {t('cancelRegistered') ||
            'O cancelamento foi registrado com sucesso.'}
        </p>
      ) : error ? (
        <p className="text-red-500 mb-2">{error}</p>
      ) : (
        <p className="mb-2">
          {t('registeringCancel') ||
            'Registrando o cancelamento...'}
        </p>
      )}
    </div>
  );
}

// src/app/success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">
        Pagamento Realizado com Sucesso!
      </h1>
      {sessionId && (
        <p className="mb-2">ID da Sessão: {sessionId}</p>
      )}
      <p>
        Obrigado pela sua compra. Seu gift card será enviado
        em breve.
      </p>
    </div>
  );
}

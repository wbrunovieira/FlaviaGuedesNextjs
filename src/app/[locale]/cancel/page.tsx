// src/app/cancel/page.tsx
'use client';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">
        Pagamento Cancelado
      </h1>
      <p>
        A transação foi cancelada. Se precisar, tente
        novamente ou entre em contato com o suporte.
      </p>
    </div>
  );
}

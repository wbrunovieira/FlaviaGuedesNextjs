'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  interface GiftCard {
    id: string;
    name: string;
    phone?: string;
    message?: string;
    amount: number;
    stripePaymentId?: string;
    cancelled?: boolean;
    createdAt: string;
  }

  const [giftCards, setGiftCards] = useState<GiftCard[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<
    string | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem('admin-auth');
    if (!isAuthenticated) {
      router.push('/adm');
    }
  }, [router]);

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const response = await fetch(
          '/api/adm-get-giftcards'
        );
        if (!response.ok)
          throw new Error('Failed to fetch gift cards');
        const data = await response.json();
        setGiftCards(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGiftCards();
  }, []);

  return (
    <div className="min-h-screen bg-gold p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Admin Dashboard
      </h2>
      {loading && (
        <p className="text-center">Loading gift cards...</p>
      )}
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCards.map(giftCard => (
            <Card
              key={giftCard.id}
              className="shadow-md p-4"
            >
              <CardContent>
                <p>
                  <strong>ID:</strong>{' '}
                  <span className="truncate max-w-[200px] inline-block overflow-hidden text-ellipsis">
                    {expandedId === giftCard.id
                      ? giftCard.id
                      : giftCard.id.slice(0, 10) + '...'}
                  </span>
                  {giftCard.id.length > 10 && (
                    <button
                      className="text-black text-xs ml-2"
                      onClick={() =>
                        setExpandedId(
                          expandedId === giftCard.id
                            ? null
                            : giftCard.id
                        )
                      }
                    >
                      {expandedId === giftCard.id
                        ? 'Ver menos'
                        : 'Ver mais'}
                    </button>
                  )}
                </p>
                <p>
                  <strong>Nome:</strong> {giftCard.name}
                </p>
                <p>
                  <strong>Telefone:</strong>{' '}
                  {giftCard.phone || 'N/A'}
                </p>
                <p>
                  <strong>Mensagem:</strong>{' '}
                  {giftCard.message || 'Sem mensagem'}
                </p>
                <p>
                  <strong>Valor:</strong> $
                  {(giftCard.amount / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Pago:</strong>{' '}
                  {giftCard.stripePaymentId ? 'Sim' : 'Não'}
                </p>
                <p>
                  <strong>Cancelado:</strong>{' '}
                  {giftCard.cancelled ? 'Sim' : 'Não'}
                </p>
                <p>
                  <strong>Data da Transação:</strong>{' '}
                  {new Date(
                    giftCard.createdAt
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="text-center mt-6">
        <Button onClick={() => router.push('/adm')}>
          Logout
        </Button>
      </div>
    </div>
  );
}

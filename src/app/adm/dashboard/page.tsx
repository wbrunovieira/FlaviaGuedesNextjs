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
      <h2 className="text-3xl font-semibold text-center mb-2">
        Admin Dashboard
      </h2>
      <p className="text-center mb-6">Últimas transações</p>
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
              className="shadow-md p-4 text-background"
            >
              <CardContent>
                <div className="space-y-2">
                  {/* Row: ID */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      ID:
                    </span>
                    <span className="text-white ml-2">
                      {expandedId === giftCard.id
                        ? giftCard.id
                        : giftCard.id.slice(0, 10) + '...'}
                      {giftCard.id.length > 10 && (
                        <button
                          className="ml-2 text-xs text-black"
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
                    </span>
                  </div>
                  {/* Row: Nome */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      Nome:
                    </span>
                    <span className="text-white ml-2">
                      {giftCard.name}
                    </span>
                  </div>
                  {/* Row: Telefone */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      Telefone:
                    </span>
                    <span className="text-white ml-2">
                      {giftCard.phone || 'Sem telefone'}
                    </span>
                  </div>
                  {/* Row: Mensagem */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      Mensagem:
                    </span>
                    <span className="text-white ml-2">
                      {giftCard.message || 'Sem mensagem'}
                    </span>
                  </div>
                  {/* Row: Valor */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      Valor:
                    </span>
                    <span className="text-white ml-2">
                      ${(giftCard.amount / 100).toFixed(2)}
                    </span>
                  </div>
                  {/* Row: Pago */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      Pago:
                    </span>
                    <span className="text-white ml-2">
                      {giftCard.stripePaymentId
                        ? 'Sim'
                        : 'Não'}
                    </span>
                  </div>
                  {/* Row: Cancelado */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right">
                      Cancelado:
                    </span>
                    <span className="text-white ml-2">
                      {giftCard.cancelled ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  {/* Row: Data da Transação */}
                  <div className="grid grid-cols-[150px,1fr] items-center">
                    <span className="font-bold text-right whitespace-nowrap">
                      Data da Transação:
                    </span>
                    <span className="text-white ml-2">
                      {new Date(
                        giftCard.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
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

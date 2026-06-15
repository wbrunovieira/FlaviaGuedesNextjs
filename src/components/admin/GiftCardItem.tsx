'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  FaGift,
  FaPhone,
  FaDollarSign,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaHashtag,
  FaComment,
  FaTrash,
  FaSpinner,
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import {
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi';
import { BsCreditCard2Back } from 'react-icons/bs';
import type { GiftCard } from '@/types/giftcard';

function paymentIcon(brand?: string) {
  if (brand === 'VISA')
    return <BsCreditCard2Back className="text-blue-400" />;
  if (brand === 'MASTERCARD')
    return <BsCreditCard2Back className="text-red-400" />;
  if (brand === 'AMEX')
    return <BsCreditCard2Back className="text-blue-600" />;
  return <FaCreditCard className="text-gold/70" />;
}

function StatusBadge({ card }: { card: GiftCard }) {
  if (card.cancelled)
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500/30">
        <FaTimesCircle /> Cancelado
      </span>
    );
  if (card.redeemed)
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold border border-gold/50">
        <FaCheckCircle /> Utilizado
      </span>
    );
  if (card.paid)
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
        <FaCheckCircle /> Pago
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-gold border border-gold/50">
      <FaClock /> Pendente
    </span>
  );
}

type GiftCardItemProps = {
  card: GiftCard;
  expanded: boolean;
  deleting: boolean;
  onToggleExpand: (id: string) => void;
  onDelete: (card: GiftCard) => void;
  onRedeem: (card: GiftCard) => void;
  onUndoRedeem: (card: GiftCard) => void;
};

export default function GiftCardItem({
  card,
  expanded,
  deleting,
  onToggleExpand,
  onDelete,
  onRedeem,
  onUndoRedeem,
}: GiftCardItemProps) {
  return (
    <Card
      className={`relative overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300 ${
        card.redeemed
          ? 'bg-gold/[0.08] border-2 border-gold/70 shadow-gold/10 hover:shadow-gold/25'
          : 'bg-graphite/80 border border-gold/30 hover:shadow-2xl hover:border-gold/50'
      }`}
    >
      {card.redeemed && (
        <div className="pointer-events-none absolute -left-12 top-6 -rotate-45 bg-gold px-12 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-background shadow-lg">
          Utilizado
        </div>
      )}
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gradient-to-r from-gold/30 to-yellow-600/30 rounded-lg">
              <FaGift className="text-2xl text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">
                  {card.name}
                </h3>
                <StatusBadge card={card} />
              </div>
              <p className="text-sm text-grayMedium">
                Para: {card.giftName || 'Não especificado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(card)}
              disabled={deleting}
              title="Excluir transação"
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group disabled:opacity-50"
            >
              {deleting ? (
                <FaSpinner className="text-lg text-red-400 animate-spin" />
              ) : (
                <FaTrash className="text-lg text-red-400/60 group-hover:text-red-400 transition-colors" />
              )}
            </button>
            <button
              onClick={() => onToggleExpand(card.id)}
              className="p-2 hover:bg-gold/20 rounded-lg transition-colors"
            >
              {expanded ? (
                <HiChevronUp className="text-xl text-gold" />
              ) : (
                <HiChevronDown className="text-xl text-gold" />
              )}
            </button>
          </div>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <FaDollarSign className="text-gold" />
            <div>
              <p className="text-xs text-gray-500">Valor</p>
              <p className="text-lg font-semibold text-white">
                ${(card.amount / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {card.cardBrand && (
            <div className="flex items-center gap-3">
              {paymentIcon(card.cardBrand)}
              <div>
                <p className="text-xs text-gray-500">
                  Pagamento
                </p>
                <p className="text-sm font-medium text-white">
                  {card.cardBrand} ****{card.cardLast4}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gold/70" />
            <div>
              <p className="text-xs text-gray-500">Data</p>
              <p className="text-sm font-medium text-white">
                {new Date(card.createdAt).toLocaleDateString(
                  'pt-BR'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Uso do gift card */}
        {!card.cancelled &&
          (card.redeemed ? (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-gold/30 bg-gold/10 px-3 py-2">
              <span className="text-xs text-gold">
                Utilizado em{' '}
                {card.redeemedAt
                  ? new Date(
                      card.redeemedAt
                    ).toLocaleDateString('pt-BR')
                  : '—'}
              </span>
              <button
                onClick={() => onUndoRedeem(card)}
                className="text-xs text-grayMedium underline transition-colors hover:text-gold"
                title="Desfazer marcação de uso"
              >
                Desfazer
              </button>
            </div>
          ) : (
            <button
              onClick={() => onRedeem(card)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gold/40 px-3 py-2 text-sm font-medium text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10"
            >
              <FaCheckCircle className="text-xs" />
              Marcar como utilizado
            </button>
          ))}

        {/* Expanded Details */}
        {expanded && (
          <div className="pt-4 border-t border-gold/20 space-y-3 animate-fadeIn">
            {card.phone && (
              <div className="flex items-center gap-3">
                <FaPhone className="text-sm text-gold/50" />
                <span className="text-sm text-grayMedium">
                  {card.phone}
                </span>
              </div>
            )}

            {card.message && (
              <div className="flex items-start gap-3">
                <FaComment className="text-sm text-gold/50 mt-1" />
                <p className="text-sm text-grayMedium">
                  {card.message}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <FaHashtag className="text-sm text-gold/50" />
              <span className="text-xs text-gray-600 font-mono">
                {card.squarePaymentId ||
                  card.stripePaymentId ||
                  card.id}
              </span>
            </div>

            {card.paymentMethod && (
              <div className="flex items-center gap-3">
                <MdPayment className="text-sm text-gold/50" />
                <span className="text-sm text-grayMedium">
                  Método: {card.paymentMethod}{' '}
                  {card.cardType && `(${card.cardType})`}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

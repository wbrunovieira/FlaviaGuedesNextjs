'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import type { GiftCard } from '@/types/giftcard';

type RedeemModalProps = {
  target: GiftCard | null;
  date: string;
  saving: boolean;
  onDateChange: (date: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export default function RedeemModal({
  target,
  date,
  saving,
  onDateChange,
  onConfirm,
  onClose,
}: RedeemModalProps) {
  return (
    <AnimatePresence>
      {target && (
        <motion.div
          key="redeem-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => !saving && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm rounded-xl border border-gold/40 bg-graphite p-6 shadow-2xl shadow-gold/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gold/15 p-2.5">
                <FaCheckCircle className="text-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Marcar como utilizado
                </h3>
                <p className="text-xs text-grayMedium">
                  {target.name} — $
                  {(target.amount / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <label
              htmlFor="redeem-date"
              className="mt-5 block text-xs font-medium text-grayMedium"
            >
              Data em que o serviço foi realizado
            </label>
            <input
              id="redeem-date"
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={e => onDateChange(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background px-4 py-2.5 text-white focus:border-gold/60 focus:outline-none [color-scheme:dark]"
            />
            <p className="mt-2 text-[11px] text-gray-500">
              Se marcar errado, dá para desfazer depois no
              próprio card.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onConfirm}
                disabled={saving || !date}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-semibold text-background transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50"
              >
                {saving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCheckCircle className="text-sm" />
                )}
                Salvar
              </button>
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 rounded-lg border border-gold/30 px-4 py-2.5 font-medium text-gold transition-all duration-300 hover:bg-gold/10 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

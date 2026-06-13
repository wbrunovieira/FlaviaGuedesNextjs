'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaCrown,
  FaSignOutAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPlus,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaArrowLeft,
  FaTrashAlt,
  FaDollarSign,
  FaPiggyBank,
} from 'react-icons/fa';

type Transaction = {
  txId: string;
  amount: number;
  note: string | null;
  date: string;
  createdAt: string;
};

type BeautyBankAccount = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  deposit: number;
  credit: number;
  balance: number;
  transactions?: Transaction[];
  createdAt: string;
};

const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function BeautyBankAdmin() {
  const [accounts, setAccounts] = useState<
    BeautyBankAccount[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set()
  );
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Use-credit modal
  const [useTarget, setUseTarget] =
    useState<BeautyBankAccount | null>(null);
  const [useAmount, setUseAmount] = useState('');
  const [useDate, setUseDate] = useState('');
  const [useNote, setUseNote] = useState('');
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const showToast = (
    type: 'success' | 'error',
    message: string
  ) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/adm-get-beautybank');
      if (res.status === 401) {
        router.push('/adm');
        return;
      }
      if (!res.ok) throw new Error('Falha ao carregar contas');
      const data = await res.json();
      data.sort(
        (a: BeautyBankAccount, b: BeautyBankAccount) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
      setAccounts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/adm-logout', { method: 'POST' });
    } finally {
      router.push('/adm');
    }
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const openUseModal = (acc: BeautyBankAccount) => {
    setUseTarget(acc);
    setUseAmount('');
    setUseNote('');
    setUseDate(new Date().toISOString().slice(0, 10));
  };

  const handleSaveUse = async () => {
    if (!useTarget || !useAmount) return;
    setSaving(true);
    try {
      const res = await fetch('/api/adm-use-beautybank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: useTarget.id,
          action: 'add',
          amount: Number(useAmount),
          note: useNote,
          date: useDate,
        }),
      });
      if (res.status === 401) {
        router.push('/adm');
        return;
      }
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || 'Falha');
      showToast(
        'success',
        `Uso de ${usd(Math.round(Number(useAmount) * 100))} registrado`
      );
      setUseTarget(null);
      await fetchAccounts();
    } catch (err) {
      showToast(
        'error',
        err instanceof Error
          ? err.message
          : 'Erro ao registrar uso'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTx = async (
    accId: string,
    txId: string
  ) => {
    try {
      const res = await fetch('/api/adm-use-beautybank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: accId,
          action: 'remove',
          txId,
        }),
      });
      if (res.status === 401) {
        router.push('/adm');
        return;
      }
      if (!res.ok) throw new Error('Falha');
      showToast('success', 'Lançamento desfeito');
      await fetchAccounts();
    } catch {
      showToast('error', 'Erro ao desfazer');
    }
  };

  const totalSold = accounts.reduce(
    (s, a) => s + a.credit,
    0
  );
  const totalOutstanding = accounts.reduce(
    (s, a) => s + a.balance,
    0
  );
  const totalRedeemed = totalSold - totalOutstanding;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-graphite to-background">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`flex items-center gap-3 rounded-xl border bg-graphite/95 p-4 shadow-2xl backdrop-blur-md ${
                toast.type === 'success'
                  ? 'border-green-500/40'
                  : 'border-red-500/40'
              }`}
            >
              {toast.type === 'success' ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaExclamationTriangle className="text-red-400" />
              )}
              <p className="text-sm text-white">
                {toast.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Use-credit modal */}
      <AnimatePresence>
        {useTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => !saving && setUseTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="w-full max-w-sm rounded-xl border border-gold/40 bg-graphite p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gold/15 p-2.5 text-gold">
                  <FaDollarSign />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Registrar uso de crédito
                  </h3>
                  <p className="text-xs text-grayMedium">
                    {useTarget.name} · saldo{' '}
                    {usd(useTarget.balance)}
                  </p>
                </div>
              </div>

              <label className="mt-5 block text-xs font-medium text-grayMedium">
                Valor utilizado (US$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                max={useTarget.balance / 100}
                value={useAmount}
                onChange={e => setUseAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background px-4 py-2.5 text-white focus:border-gold/60 focus:outline-none"
              />

              <label className="mt-4 block text-xs font-medium text-grayMedium">
                Data do serviço
              </label>
              <input
                type="date"
                value={useDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => setUseDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background px-4 py-2.5 text-white [color-scheme:dark] focus:border-gold/60 focus:outline-none"
              />

              <label className="mt-4 block text-xs font-medium text-grayMedium">
                Observação (opcional)
              </label>
              <input
                type="text"
                value={useNote}
                onChange={e => setUseNote(e.target.value)}
                placeholder="Ex.: Balayage + corte"
                className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background px-4 py-2.5 text-white placeholder-grayMedium focus:border-gold/60 focus:outline-none"
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveUse}
                  disabled={saving || !useAmount}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-semibold text-background transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50"
                >
                  {saving ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    'Salvar'
                  )}
                </button>
                <button
                  onClick={() => setUseTarget(null)}
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

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-r from-gold to-yellow-600 p-3 shadow-lg shadow-gold/20">
              <FaCrown className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-gold via-yellow-500 to-gold bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                VIP Beauty Bank
              </h1>
              <p className="mt-1 text-grayMedium">
                Créditos pré-pagos das clientes
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/adm/dashboard')}
              className="flex items-center gap-2 border border-gold/30 bg-graphite text-gold"
            >
              <FaArrowLeft /> Gift Cards
            </Button>
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gold/30 bg-graphite text-gold"
            >
              <FaSignOutAlt /> Sair
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-0 bg-gradient-to-br from-gold to-yellow-600 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">
                    Crédito Vendido
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {usd(totalSold)}
                  </p>
                </div>
                <FaPiggyBank className="text-4xl text-yellow-200 opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gold/30 bg-gradient-to-br from-graphite to-gray-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gold">
                    Saldo em Aberto
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {usd(totalOutstanding)}
                  </p>
                  <p className="mt-1 text-xs text-grayMedium">
                    A ser utilizado
                  </p>
                </div>
                <FaDollarSign className="text-4xl text-gold opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gold/30 bg-gradient-to-br from-graphite to-gray-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gold">
                    Já Utilizado
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {usd(totalRedeemed)}
                  </p>
                </div>
                <FaCheckCircle className="text-4xl text-gold opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="mb-4 animate-spin text-6xl text-gold" />
            <p className="text-grayMedium">Carregando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaExclamationTriangle className="mb-4 text-6xl text-red-500" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaCrown className="mb-4 text-6xl text-gray-500" />
            <p className="text-grayMedium">
              Nenhuma conta Beauty Bank ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {accounts.map(acc => {
              const used = acc.credit - acc.balance;
              const pct = acc.credit
                ? (used / acc.credit) * 100
                : 0;
              const txs = acc.transactions ?? [];
              return (
                <Card
                  key={acc.id}
                  className="border border-gold/30 bg-graphite/80 shadow-xl backdrop-blur-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {acc.name}
                        </h3>
                        <p className="text-xs text-grayMedium">
                          Depósito {usd(acc.deposit)} ·
                          Crédito {usd(acc.credit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gold">
                          {usd(acc.balance)}
                        </p>
                        <p className="text-xs text-grayMedium">
                          saldo
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-grayMedium">
                        {usd(used)} utilizado de{' '}
                        {usd(acc.credit)}
                      </p>
                    </div>

                    {(acc.phone || acc.email) && (
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-grayMedium">
                        {acc.phone && (
                          <span className="flex items-center gap-1.5">
                            <FaPhone className="text-gold/60" />
                            {acc.phone}
                          </span>
                        )}
                        {acc.email && (
                          <span className="flex items-center gap-1.5">
                            <FaEnvelope className="text-gold/60" />
                            {acc.email}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openUseModal(acc)}
                        disabled={acc.balance <= 0}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background transition-all duration-300 hover:bg-opacity-90 disabled:opacity-40"
                      >
                        <FaPlus className="text-xs" />
                        Registrar uso
                      </button>
                      {txs.length > 0 && (
                        <button
                          onClick={() =>
                            toggleExpand(acc.id)
                          }
                          className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
                        >
                          {expanded.has(acc.id)
                            ? 'Ocultar'
                            : `Histórico (${txs.length})`}
                        </button>
                      )}
                    </div>

                    {/* Transaction history */}
                    {expanded.has(acc.id) &&
                      txs.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-gold/20 pt-4">
                          {[...txs]
                            .sort(
                              (a, b) =>
                                new Date(
                                  b.date
                                ).getTime() -
                                new Date(a.date).getTime()
                            )
                            .map(tx => (
                              <div
                                key={tx.txId}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <div className="flex items-center gap-2 text-grayMedium">
                                  <FaCalendarAlt className="text-xs text-gold/50" />
                                  <span>
                                    {new Date(
                                      tx.date
                                    ).toLocaleDateString(
                                      'pt-BR'
                                    )}
                                  </span>
                                  {tx.note && (
                                    <span className="text-gray-500">
                                      · {tx.note}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-white">
                                    −{usd(tx.amount)}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleRemoveTx(
                                        acc.id,
                                        tx.txId
                                      )
                                    }
                                    title="Desfazer lançamento"
                                    className="text-red-400/60 transition-colors hover:text-red-400"
                                  >
                                    <FaTrashAlt className="text-xs" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

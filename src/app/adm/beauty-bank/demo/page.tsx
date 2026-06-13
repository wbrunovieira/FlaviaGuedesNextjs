'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  FaCrown,
  FaPlus,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaTrashAlt,
  FaDollarSign,
  FaPiggyBank,
  FaCheckCircle,
} from 'react-icons/fa';

type Transaction = {
  txId: string;
  amount: number;
  note: string | null;
  date: string;
};

type Account = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  deposit: number;
  credit: number;
  balance: number;
  transactions: Transaction[];
};

const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'demo1',
    name: 'Maria Silva',
    phone: '(954) 555-0142',
    email: 'maria.silva@email.com',
    deposit: 100000,
    credit: 110000,
    balance: 85000,
    transactions: [
      {
        txId: 't1',
        amount: 15000,
        note: 'Balayage + corte',
        date: daysAgo(28),
      },
      {
        txId: 't2',
        amount: 10000,
        note: 'Gloss + escova',
        date: daysAgo(7),
      },
    ],
  },
  {
    id: 'demo2',
    name: 'Júlia Mendes',
    phone: null,
    email: 'julia.mendes@email.com',
    deposit: 200000,
    credit: 245000,
    balance: 185000,
    transactions: [
      {
        txId: 't3',
        amount: 60000,
        note: 'Mechas full + tratamento',
        date: daysAgo(15),
      },
    ],
  },
  {
    id: 'demo3',
    name: 'Ana Costa',
    phone: '(954) 555-0198',
    email: null,
    deposit: 50000,
    credit: 53000,
    balance: 35000,
    transactions: [
      {
        txId: 't4',
        amount: 18000,
        note: 'Coloração base',
        date: daysAgo(10),
      },
    ],
  },
  {
    id: 'demo4',
    name: 'Carla Souza',
    phone: '(954) 555-0110',
    email: 'carla.souza@email.com',
    deposit: 150000,
    credit: 170000,
    balance: 170000,
    transactions: [],
  },
];

export default function BeautyBankDemo() {
  const [accounts, setAccounts] =
    useState<Account[]>(MOCK_ACCOUNTS);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['demo1'])
  );
  const [useTarget, setUseTarget] =
    useState<Account | null>(null);
  const [useAmount, setUseAmount] = useState('');
  const [useDate, setUseDate] = useState('');
  const [useNote, setUseNote] = useState('');

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const openUseModal = (acc: Account) => {
    setUseTarget(acc);
    setUseAmount('');
    setUseNote('');
    setUseDate(new Date().toISOString().slice(0, 10));
  };

  const handleSaveUse = () => {
    if (!useTarget || !useAmount) return;
    const amount = Math.round(Number(useAmount) * 100);
    if (amount <= 0 || amount > useTarget.balance) return;
    setAccounts(prev =>
      prev.map(a =>
        a.id === useTarget.id
          ? {
              ...a,
              balance: a.balance - amount,
              transactions: [
                ...a.transactions,
                {
                  txId: `t-${Date.now()}`,
                  amount,
                  note: useNote || null,
                  date: new Date(
                    `${useDate}T12:00:00`
                  ).toISOString(),
                },
              ],
            }
          : a
      )
    );
    setExpanded(prev => new Set(prev).add(useTarget.id));
    setUseTarget(null);
  };

  const handleRemoveTx = (accId: string, txId: string) => {
    setAccounts(prev =>
      prev.map(a => {
        if (a.id !== accId) return a;
        const tx = a.transactions.find(t => t.txId === txId);
        if (!tx) return a;
        return {
          ...a,
          balance: a.balance + tx.amount,
          transactions: a.transactions.filter(
            t => t.txId !== txId
          ),
        };
      })
    );
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
      {/* Use-credit modal */}
      {useTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setUseTarget(null)}
        >
          <div
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
                disabled={!useAmount}
                className="flex-1 rounded-lg bg-gold px-4 py-2.5 font-semibold text-background transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50"
              >
                Salvar
              </button>
              <button
                onClick={() => setUseTarget(null)}
                className="flex-1 rounded-lg border border-gold/30 px-4 py-2.5 font-medium text-gold transition-all duration-300 hover:bg-gold/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-8">
        {/* Demo banner */}
        <div className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-center text-sm text-gold">
          ✨ Demonstração — dados fictícios para visualização
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
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

        {/* Accounts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {accounts.map(acc => {
            const used = acc.credit - acc.balance;
            const pct = acc.credit
              ? (used / acc.credit) * 100
              : 0;
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
                        Depósito {usd(acc.deposit)} · Crédito{' '}
                        {usd(acc.credit)}
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
                    {acc.transactions.length > 0 && (
                      <button
                        onClick={() => toggleExpand(acc.id)}
                        className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
                      >
                        {expanded.has(acc.id)
                          ? 'Ocultar'
                          : `Histórico (${acc.transactions.length})`}
                      </button>
                    )}
                  </div>

                  {expanded.has(acc.id) &&
                    acc.transactions.length > 0 && (
                      <div className="mt-4 space-y-2 border-t border-gold/20 pt-4">
                        {[...acc.transactions]
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
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
      </div>
    </div>
  );
}

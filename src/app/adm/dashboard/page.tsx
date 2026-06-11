'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaGift,
  FaPhone,
  FaDollarSign,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaCalendarAlt,
  FaHashtag,
  FaComment,
  FaTrophy,
  FaArrowUp,
  FaSearch,
  FaFilter,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { HiSparkles, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { BsCreditCard2Back } from 'react-icons/bs';
import { RiVipCrownFill } from 'react-icons/ri';

export default function AdminDashboard() {
  interface GiftCard {
    id: string;
    name: string;
    giftName: string;
    phone?: string;
    message?: string;
    amount: number;
    stripePaymentId?: string;
    squarePaymentId?: string;
    paid?: boolean;
    cancelled?: boolean;
    redeemed?: boolean;
    redeemedAt?: string | null;
    createdAt: string;
    paymentMethod?: string;
    cardBrand?: string;
    cardLast4?: string;
    cardType?: string;
  }

  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<GiftCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'redeemed' | 'unredeemed'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Delete states
  const [confirmTarget, setConfirmTarget] = useState<GiftCard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redeem states
  const [redeemTarget, setRedeemTarget] = useState<GiftCard | null>(null);
  const [redeemDate, setRedeemDate] = useState<string>('');
  const [redeemSaving, setRedeemSaving] = useState<boolean>(false);

  const router = useRouter();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openRedeemModal = (card: GiftCard) => {
    setRedeemTarget(card);
    setRedeemDate(new Date().toISOString().slice(0, 10));
  };

  const handleConfirmRedeem = async () => {
    if (!redeemTarget || !redeemDate) return;
    setRedeemSaving(true);
    try {
      const response = await fetch('/api/adm-redeem-giftcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: redeemTarget.id,
          redeemedAt: `${redeemDate}T12:00:00`,
        }),
      });
      if (response.status === 401) {
        router.push('/adm');
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setGiftCards(prev =>
        prev.map(card =>
          card.id === redeemTarget.id
            ? { ...card, redeemed: true, redeemedAt: data.redeemedAt }
            : card
        )
      );
      showToast('success', `Gift card de ${redeemTarget.name} marcado como utilizado`);
      setRedeemTarget(null);
    } catch {
      showToast('error', 'Erro ao marcar como utilizado. Tente novamente.');
    } finally {
      setRedeemSaving(false);
    }
  };

  const handleUndoRedeem = async (card: GiftCard) => {
    try {
      const response = await fetch('/api/adm-redeem-giftcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, undo: true }),
      });
      if (response.status === 401) {
        router.push('/adm');
        return;
      }
      if (!response.ok) throw new Error('Failed');
      setGiftCards(prev =>
        prev.map(c =>
          c.id === card.id
            ? { ...c, redeemed: false, redeemedAt: null }
            : c
        )
      );
      showToast('success', 'Marcação de uso desfeita');
    } catch {
      showToast('error', 'Erro ao desfazer. Tente novamente.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    const target = confirmTarget;
    setConfirmTarget(null);
    setDeletingId(target.id);
    try {
      const response = await fetch(`/api/adm-delete-giftcard?id=${target.id}`, {
        method: 'DELETE',
      });
      if (response.status === 401) {
        router.push('/adm');
        return;
      }
      if (!response.ok) throw new Error('Failed to delete gift card');
      setGiftCards(prev => prev.filter(card => card.id !== target.id));
      showToast('success', `Transação de ${target.name} excluída com sucesso`);
    } catch {
      showToast('error', 'Erro ao excluir a transação. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/adm-logout', { method: 'POST' });
    } finally {
      router.push('/adm');
    }
  };

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const response = await fetch('/api/adm-get-giftcards');
        if (response.status === 401) {
          router.push('/adm');
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch gift cards');
        const data = await response.json();
        data.sort((a: GiftCard, b: GiftCard) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setGiftCards(data);
        setFilteredCards(data);
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
  }, [router]);

  // Filter logic
  useEffect(() => {
    let filtered = [...giftCards];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        card =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.giftName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === 'paid') {
      filtered = filtered.filter(card => card.paid === true);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter(card => card.paid !== true);
    } else if (statusFilter === 'redeemed') {
      filtered = filtered.filter(card => card.redeemed === true);
    } else if (statusFilter === 'unredeemed') {
      filtered = filtered.filter(card => !card.redeemed && !card.cancelled);
    }

    // Date range filter
    const now = new Date();
    if (dateRange === 'today') {
      filtered = filtered.filter(card => {
        const cardDate = new Date(card.createdAt);
        return cardDate.toDateString() === now.toDateString();
      });
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(card => new Date(card.createdAt) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(card => new Date(card.createdAt) >= monthAgo);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredCards(filtered);
    setCurrentPage(1);
  }, [giftCards, searchTerm, sortOrder, statusFilter, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCards.length / ITEMS_PER_PAGE)
  );
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getPaymentIcon = (method?: string, brand?: string) => {
    if (brand === 'VISA') return <BsCreditCard2Back className="text-blue-400" />;
    if (brand === 'MASTERCARD') return <BsCreditCard2Back className="text-red-400" />;
    if (brand === 'AMEX') return <BsCreditCard2Back className="text-blue-600" />;
    return <FaCreditCard className="text-gold/70" />;
  };

  const getStatusBadge = (paid?: boolean, cancelled?: boolean, redeemed?: boolean) => {
    if (cancelled) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500/30">
          <FaTimesCircle /> Cancelado
        </span>
      );
    }
    if (redeemed) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold border border-gold/50">
          <FaCheckCircle /> Utilizado
        </span>
      );
    }
    if (paid) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
          <FaCheckCircle /> Pago
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-gold border border-gold/50">
        <FaClock /> Pendente
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-graphite to-background">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm">
        <AnimatePresence>
          {confirmTarget && (
            <motion.div
              key="confirm-toast"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-graphite/95 backdrop-blur-md border border-red-500/40 rounded-xl shadow-2xl shadow-red-500/10 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                  <FaTrash className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Excluir transação?</p>
                  <p className="text-xs text-grayMedium mt-1 truncate">
                    {confirmTarget.name} — ${(confirmTarget.amount / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-red-400/80 mt-1">Essa ação não pode ser desfeita.</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleConfirmDelete}
                      className="px-3 py-1.5 bg-red-500/90 hover:bg-red-500 rounded-lg text-white text-xs font-medium transition-colors"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => setConfirmTarget(null)}
                      className="px-3 py-1.5 bg-transparent hover:bg-gold/10 border border-gold/30 rounded-lg text-gold text-xs font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {toast && (
            <motion.div
              key="result-toast"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`bg-graphite/95 backdrop-blur-md border rounded-xl shadow-2xl p-4 flex items-center gap-3 ${
                toast.type === 'success'
                  ? 'border-green-500/40 shadow-green-500/10'
                  : 'border-red-500/40 shadow-red-500/10'
              }`}
            >
              {toast.type === 'success' ? (
                <FaCheckCircle className="text-green-400 shrink-0" />
              ) : (
                <FaExclamationTriangle className="text-red-400 shrink-0" />
              )}
              <p className="text-sm text-white">{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal: marcar gift card como utilizado */}
      <AnimatePresence>
        {redeemTarget && (
          <motion.div
            key="redeem-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => !redeemSaving && setRedeemTarget(null)}
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
                  <h3 className="font-semibold text-white">Marcar como utilizado</h3>
                  <p className="text-xs text-grayMedium">
                    {redeemTarget.name} — ${(redeemTarget.amount / 100).toFixed(2)}
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
                value={redeemDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => setRedeemDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background px-4 py-2.5 text-white focus:border-gold/60 focus:outline-none [color-scheme:dark]"
              />
              <p className="mt-2 text-[11px] text-gray-500">
                Se marcar errado, dá para desfazer depois no próprio card.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleConfirmRedeem}
                  disabled={redeemSaving || !redeemDate}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-semibold text-background transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50"
                >
                  {redeemSaving ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheckCircle className="text-sm" />
                  )}
                  Salvar
                </button>
                <button
                  onClick={() => setRedeemTarget(null)}
                  disabled={redeemSaving}
                  className="flex-1 rounded-lg border border-gold/30 px-4 py-2.5 font-medium text-gold transition-all duration-300 hover:bg-gold/10 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          {/* Mobile: Logout button at top */}
          <div className="sm:hidden flex justify-end mb-4">
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-graphite to-gray-800 hover:from-gray-800 hover:to-gray-900 text-gold border border-gold/30 shadow-lg transition-all duration-300 hover:shadow-gold/25 flex items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </Button>
          </div>

          {/* Desktop layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-gold to-yellow-600 rounded-xl shadow-lg shadow-gold/20">
                <RiVipCrownFill className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold via-yellow-500 to-gold bg-clip-text text-transparent animate-gradient">
                  Admin Dashboard
                </h1>
                <p className="text-grayMedium mt-1">Gerenciar Gift Cards</p>
              </div>
            </div>
            {/* Desktop: Logout button inline */}
            <Button
              onClick={handleLogout}
              className="hidden sm:flex bg-gradient-to-r from-graphite to-gray-800 hover:from-gray-800 hover:to-gray-900 text-gold border border-gold/30 shadow-lg transition-all duration-300 hover:shadow-gold/25 items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Total Gift Cards */}
          <Card className="bg-gradient-to-br from-gold to-yellow-600 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Total Gift Cards</p>
                  <p className="text-3xl font-bold text-white mt-2">{giftCards.length}</p>
                  <p className="text-yellow-200/70 text-xs mt-1 flex items-center gap-1">
                    <FaArrowUp className="text-xs" />
                    {(() => {
                      const now = new Date();
                      const thisMonth = giftCards.filter(card => {
                        const d = new Date(card.createdAt);
                        return (
                          d.getMonth() === now.getMonth() &&
                          d.getFullYear() === now.getFullYear()
                        );
                      }).length;
                      return `+${thisMonth} este mês`;
                    })()}
                  </p>
                </div>
                <FaGift className="text-4xl text-yellow-200 opacity-70" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2 - Total Vendido */}
          <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold text-sm font-medium">Total Vendido</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ${giftCards.reduce((sum, card) => sum + (card.amount / 100), 0).toFixed(2)}
                  </p>
                  <p className="text-grayMedium text-xs mt-1">Em gift cards</p>
                </div>
                <FaDollarSign className="text-4xl text-gold opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3 - Vendas este mês */}
          <Card className="bg-gradient-to-br from-gold/80 to-yellow-700 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Vendas este Mês</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {(() => {
                      const now = new Date();
                      const monthTotal = giftCards
                        .filter(card => {
                          const d = new Date(card.createdAt);
                          return (
                            d.getMonth() === now.getMonth() &&
                            d.getFullYear() === now.getFullYear()
                          );
                        })
                        .reduce((sum, card) => sum + card.amount / 100, 0);
                      return `$${monthTotal.toFixed(2)}`;
                    })()}
                  </p>
                  <p className="text-yellow-200/70 text-xs mt-1">Em gift cards</p>
                </div>
                <FaCheckCircle className="text-4xl text-yellow-200 opacity-70" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4 - Ticket Médio */}
          <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold text-sm font-medium">Ticket Médio</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {giftCards.length > 0
                      ? `$${(
                          giftCards.reduce((sum, card) => sum + card.amount / 100, 0) /
                          giftCards.length
                        ).toFixed(2)}`
                      : '$0.00'}
                  </p>
                  <p className="text-grayMedium text-xs mt-1">Por gift card</p>
                </div>
                <FaTrophy className="text-4xl text-gold opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* Card 5 - Utilizados */}
          <Card className="bg-gradient-to-br from-gold/80 to-yellow-700 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Utilizados</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {giftCards.filter(card => card.redeemed).length}
                  </p>
                  <p className="text-yellow-200/70 text-xs mt-1">Serviço já realizado</p>
                </div>
                <FaCheckCircle className="text-4xl text-yellow-200 opacity-70" />
              </div>
            </CardContent>
          </Card>

          {/* Card 6 - A Utilizar */}
          <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold text-sm font-medium">A Utilizar</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {giftCards.filter(card => !card.redeemed && !card.cancelled).length}
                  </p>
                  <p className="text-grayMedium text-xs mt-1">Aguardando o cliente</p>
                </div>
                <FaClock className="text-4xl text-gold opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-6xl text-gold animate-spin mb-4" />
            <p className="text-grayMedium text-lg">Carregando gift cards...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : giftCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaGift className="text-6xl text-gray-500 mb-4" />
            <p className="text-grayMedium text-lg">Nenhum gift card encontrado.</p>
          </div>
        ) : (
          <div>
            {/* Search and Filters Section */}
            <div className="mb-8 rounded-xl border border-gold/15 bg-graphite/40 backdrop-blur-md p-4 sm:p-5 space-y-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold/60">
                <FaFilter className="text-xs" />
                Filtros
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* Busca */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="filter-search"
                    className="block mb-1.5 text-xs font-medium text-grayMedium"
                  >
                    Buscar por nome
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold/50" />
                    <input
                      id="filter-search"
                      type="text"
                      placeholder="Nome do comprador ou presenteado..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-graphite/80 border border-gold/30 rounded-lg text-white placeholder-grayMedium focus:outline-none focus:border-gold/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Ordenação */}
                <div>
                  <label
                    htmlFor="filter-sort"
                    className="block mb-1.5 text-xs font-medium text-grayMedium"
                  >
                    Ordenar por
                  </label>
                  <div className="relative">
                    <select
                      id="filter-sort"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-4 py-2 bg-graphite/80 border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
                    >
                      <option value="desc">Mais recente</option>
                      <option value="asc">Mais antigo</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {sortOrder === 'desc' ? (
                        <FaSortAmountDown className="text-gold/50" />
                      ) : (
                        <FaSortAmountUp className="text-gold/50" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="filter-status"
                    className="block mb-1.5 text-xs font-medium text-grayMedium"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="filter-status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'pending' | 'redeemed' | 'unredeemed')}
                      className="w-full px-4 py-2 bg-graphite/80 border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
                    >
                      <option value="all">Todos</option>
                      <option value="unredeemed">Não utilizados</option>
                      <option value="redeemed">Utilizados</option>
                      <option value="paid">Pagos</option>
                      <option value="pending">Pendentes</option>
                    </select>
                    <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gold/50" />
                  </div>
                </div>

                {/* Período */}
                <div>
                  <label
                    htmlFor="filter-period"
                    className="block mb-1.5 text-xs font-medium text-grayMedium"
                  >
                    Período
                  </label>
                  <div className="relative">
                    <select
                      id="filter-period"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as 'all' | 'today' | 'week' | 'month')}
                      className="w-full px-4 py-2 bg-graphite/80 border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
                    >
                      <option value="all">Todo Período</option>
                      <option value="today">Hoje</option>
                      <option value="week">Última Semana</option>
                      <option value="month">Último Mês</option>
                    </select>
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gold/50" />
                  </div>
                </div>

                {/* Limpar Filtros */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortOrder('desc');
                    setStatusFilter('all');
                    setDateRange('all');
                  }}
                  className="px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded-lg text-gold font-medium transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <FaTimesCircle />
                  Limpar Filtros
                </button>
              </div>

              {/* Active Filters Indicators */}
              {(searchTerm || statusFilter !== 'all' || dateRange !== 'all') && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-grayMedium">Filtros ativos:</span>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="px-2 py-1 bg-gold/20 border border-gold/30 rounded-lg text-gold text-xs">
                        Busca: {searchTerm}
                      </span>
                    )}
                    {statusFilter !== 'all' && (
                      <span className="px-2 py-1 bg-gold/20 border border-gold/30 rounded-lg text-gold text-xs">
                        Status: {
                          statusFilter === 'paid' ? 'Pagos' :
                          statusFilter === 'pending' ? 'Pendentes' :
                          statusFilter === 'redeemed' ? 'Utilizados' :
                          'Não utilizados'
                        }
                      </span>
                    )}
                    {dateRange !== 'all' && (
                      <span className="px-2 py-1 bg-gold/20 border border-gold/30 rounded-lg text-gold text-xs">
                        Período: {
                          dateRange === 'today' ? 'Hoje' :
                          dateRange === 'week' ? 'Última Semana' :
                          'Último Mês'
                        }
                      </span>
                    )}
                  </div>
                  <span className="text-grayMedium ml-auto">
                    {filteredCards.length} de {giftCards.length} resultados
                  </span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <HiSparkles className="text-gold" />
              Últimas Transações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCards.map(giftCard => (
              <Card
                key={giftCard.id}
                className="bg-graphite/80 backdrop-blur-md border border-gold/30 shadow-xl hover:shadow-2xl hover:border-gold/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-r from-gold/30 to-yellow-600/30 rounded-lg">
                        <FaGift className="text-2xl text-gold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{giftCard.name}</h3>
                          {getStatusBadge(giftCard.paid, giftCard.cancelled, giftCard.redeemed)}
                        </div>
                        <p className="text-sm text-grayMedium">Para: {giftCard.giftName || 'Não especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setConfirmTarget(giftCard)}
                        disabled={deletingId === giftCard.id}
                        title="Excluir transação"
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group disabled:opacity-50"
                      >
                        {deletingId === giftCard.id ? (
                          <FaSpinner className="text-lg text-red-400 animate-spin" />
                        ) : (
                          <FaTrash className="text-lg text-red-400/60 group-hover:text-red-400 transition-colors" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleCardExpansion(giftCard.id)}
                        className="p-2 hover:bg-gold/20 rounded-lg transition-colors"
                      >
                        {expandedCards.has(giftCard.id) ? (
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
                          ${(giftCard.amount / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {giftCard.cardBrand && (
                      <div className="flex items-center gap-3">
                        {getPaymentIcon(giftCard.paymentMethod, giftCard.cardBrand)}
                        <div>
                          <p className="text-xs text-gray-500">Pagamento</p>
                          <p className="text-sm font-medium text-white">
                            {giftCard.cardBrand} ****{giftCard.cardLast4}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-gold/70" />
                      <div>
                        <p className="text-xs text-gray-500">Data</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(giftCard.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uso do gift card */}
                  {!giftCard.cancelled && (
                    giftCard.redeemed ? (
                      <div className="mt-4 flex items-center justify-between rounded-lg border border-gold/30 bg-gold/10 px-3 py-2">
                        <span className="text-xs text-gold">
                          Utilizado em{' '}
                          {giftCard.redeemedAt
                            ? new Date(giftCard.redeemedAt).toLocaleDateString('pt-BR')
                            : '—'}
                        </span>
                        <button
                          onClick={() => handleUndoRedeem(giftCard)}
                          className="text-xs text-grayMedium underline transition-colors hover:text-gold"
                          title="Desfazer marcação de uso"
                        >
                          Desfazer
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openRedeemModal(giftCard)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gold/40 px-3 py-2 text-sm font-medium text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10"
                      >
                        <FaCheckCircle className="text-xs" />
                        Marcar como utilizado
                      </button>
                    )
                  )}

                  {/* Expanded Details */}
                  {expandedCards.has(giftCard.id) && (
                    <div className="pt-4 border-t border-gold/20 space-y-3 animate-fadeIn">
                      {giftCard.phone && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-sm text-gold/50" />
                          <span className="text-sm text-grayMedium">{giftCard.phone}</span>
                        </div>
                      )}

                      {giftCard.message && (
                        <div className="flex items-start gap-3">
                          <FaComment className="text-sm text-gold/50 mt-1" />
                          <p className="text-sm text-grayMedium">{giftCard.message}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <FaHashtag className="text-sm text-gold/50" />
                        <span className="text-xs text-gray-600 font-mono">
                          {giftCard.squarePaymentId || giftCard.stripePaymentId || giftCard.id}
                        </span>
                      </div>

                      {giftCard.paymentMethod && (
                        <div className="flex items-center gap-3">
                          <MdPayment className="text-sm text-gold/50" />
                          <span className="text-sm text-grayMedium">
                            Método: {giftCard.paymentMethod} {giftCard.cardType && `(${giftCard.cardType})`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-grayMedium">
                  Mostrando{' '}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredCards.length)}{' '}
                  de {filteredCards.length} transações
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gold/30 text-gold text-sm font-medium transition-all duration-300 hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      page =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, idx, pages) => (
                      <React.Fragment key={page}>
                        {idx > 0 && pages[idx - 1] !== page - 1 && (
                          <span className="text-grayMedium px-1">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-gold text-background'
                              : 'border border-gold/30 text-gold hover:bg-gold/10'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gold/30 text-gold text-sm font-medium transition-all duration-300 hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
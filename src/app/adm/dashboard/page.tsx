'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  filterGiftCards,
  sortGiftCards,
  giftCardStats,
} from '@/lib/giftcard-stats';
import type { GiftCard } from '@/types/giftcard';
import StatsCards from '@/components/admin/StatsCards';
import GiftCardItem from '@/components/admin/GiftCardItem';
import RedeemModal from '@/components/admin/RedeemModal';
import Pagination from '@/components/admin/Pagination';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  FaGift,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaCrown,
  FaExclamationTriangle,
  FaSpinner,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { RiVipCrownFill } from 'react-icons/ri';

export default function AdminDashboard() {
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

  // Filter logic (pure helpers — unit tested in giftcard-stats.ts)
  useEffect(() => {
    const filtered = sortGiftCards(
      filterGiftCards(giftCards, {
        search: searchTerm,
        status: statusFilter,
        dateRange,
      }),
      sortOrder
    );
    setFilteredCards(filtered);
    setCurrentPage(1);
  }, [giftCards, searchTerm, sortOrder, statusFilter, dateRange]);

  const stats = giftCardStats(giftCards);

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
      <RedeemModal
        target={redeemTarget}
        date={redeemDate}
        saving={redeemSaving}
        onDateChange={setRedeemDate}
        onConfirm={handleConfirmRedeem}
        onClose={() => setRedeemTarget(null)}
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          {/* Mobile: action buttons at top */}
          <div className="sm:hidden flex justify-end gap-2 mb-4">
            <Button
              onClick={() => router.push('/adm/beauty-bank')}
              className="bg-gradient-to-r from-gold to-yellow-600 text-white border-0 shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaCrown />
              Beauty Bank
            </Button>
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
            {/* Desktop: action buttons inline */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                onClick={() => router.push('/adm/beauty-bank')}
                className="bg-gradient-to-r from-gold to-yellow-600 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-gold/25 flex items-center gap-2"
              >
                <FaCrown />
                Beauty Bank
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-graphite to-gray-800 hover:from-gray-800 hover:to-gray-900 text-gold border border-gold/30 shadow-lg transition-all duration-300 hover:shadow-gold/25 flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <StatsCards stats={stats} />

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
              <GiftCardItem
                key={giftCard.id}
                card={giftCard}
                expanded={expandedCards.has(giftCard.id)}
                deleting={deletingId === giftCard.id}
                onToggleExpand={toggleCardExpansion}
                onDelete={setConfirmTarget}
                onRedeem={openRedeemModal}
                onUndoRedeem={handleUndoRedeem}
              />
            ))}
            </div>

            {/* Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredCards.length}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
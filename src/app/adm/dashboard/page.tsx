'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { MdCreditCard, MdPayment } from 'react-icons/md';
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<'all' | 'card' | 'other'>('all');

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-auth');
    if (!isAuthenticated) {
      router.push('/adm');
    }
  }, [router]);

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const response = await fetch('/api/adm-get-giftcards');
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
  }, []);

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

    // Payment type filter
    if (paymentTypeFilter === 'card') {
      filtered = filtered.filter(card => card.paymentMethod === 'CARD');
    } else if (paymentTypeFilter === 'other') {
      filtered = filtered.filter(card => card.paymentMethod && card.paymentMethod !== 'CARD');
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredCards(filtered);
  }, [giftCards, searchTerm, sortOrder, statusFilter, dateRange, paymentTypeFilter]);

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

  const getStatusBadge = (paid?: boolean, cancelled?: boolean) => {
    if (cancelled) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500/30">
          <FaTimesCircle /> Cancelado
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
              onClick={() => router.push('/adm')}
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
              onClick={() => router.push('/adm')}
              className="hidden sm:flex bg-gradient-to-r from-graphite to-gray-800 hover:from-gray-800 hover:to-gray-900 text-gold border border-gold/30 shadow-lg transition-all duration-300 hover:shadow-gold/25 items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Total Gift Cards */}
          <Card className="bg-gradient-to-br from-gold to-yellow-600 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Total Gift Cards</p>
                  <p className="text-3xl font-bold text-white mt-2">{giftCards.length}</p>
                  <p className="text-yellow-200/70 text-xs mt-1 flex items-center gap-1">
                    <FaArrowUp className="text-xs" /> +12% este mês
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

          {/* Card 3 - Pagos */}
          <Card className="bg-gradient-to-br from-gold/80 to-yellow-700 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pagos</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {giftCards.filter(card => card.paid).length}
                  </p>
                  <p className="text-yellow-200/70 text-xs mt-1">Confirmados</p>
                </div>
                <FaCheckCircle className="text-4xl text-yellow-200 opacity-70" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4 - Taxa de Conversão */}
          <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold text-sm font-medium">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {giftCards.length > 0
                      ? Math.round((giftCards.filter(card => card.paid).length / giftCards.length) * 100)
                      : 0}%
                  </p>
                  <p className="text-grayMedium text-xs mt-1">Sucesso</p>
                </div>
                <FaTrophy className="text-4xl text-gold opacity-50" />
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
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold/50" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-graphite/80 backdrop-blur-md border border-gold/30 rounded-xl text-white placeholder-grayMedium focus:outline-none focus:border-gold/50 transition-all duration-300"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Sort Order */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-4 py-2 bg-graphite/80 backdrop-blur-md border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
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

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'pending')}
                    className="w-full px-4 py-2 bg-graphite/80 backdrop-blur-md border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
                  >
                    <option value="all">Todos Status</option>
                    <option value="paid">Pagos</option>
                    <option value="pending">Pendentes</option>
                  </select>
                  <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gold/50" />
                </div>

                {/* Date Range Filter */}
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as 'all' | 'today' | 'week' | 'month')}
                    className="w-full px-4 py-2 bg-graphite/80 backdrop-blur-md border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
                  >
                    <option value="all">Todo Período</option>
                    <option value="today">Hoje</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                  </select>
                  <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gold/50" />
                </div>

                {/* Payment Type Filter */}
                <div className="relative">
                  <select
                    value={paymentTypeFilter}
                    onChange={(e) => setPaymentTypeFilter(e.target.value as 'all' | 'card' | 'other')}
                    className="w-full px-4 py-2 bg-graphite/80 backdrop-blur-md border border-gold/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-all duration-300"
                  >
                    <option value="all">Todos Pagamentos</option>
                    <option value="card">Cartão</option>
                    <option value="other">Outros</option>
                  </select>
                  <MdCreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gold/50" />
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortOrder('desc');
                    setStatusFilter('all');
                    setDateRange('all');
                    setPaymentTypeFilter('all');
                  }}
                  className="px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded-lg text-gold font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaTimesCircle />
                  Limpar
                </button>
              </div>

              {/* Active Filters Indicators */}
              {(searchTerm || statusFilter !== 'all' || dateRange !== 'all' || paymentTypeFilter !== 'all') && (
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
                        Status: {statusFilter === 'paid' ? 'Pagos' : 'Pendentes'}
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
                    {paymentTypeFilter !== 'all' && (
                      <span className="px-2 py-1 bg-gold/20 border border-gold/30 rounded-lg text-gold text-xs">
                        Pagamento: {paymentTypeFilter === 'card' ? 'Cartão' : 'Outros'}
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
            {filteredCards.map(giftCard => (
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
                          {getStatusBadge(giftCard.paid, giftCard.cancelled)}
                        </div>
                        <p className="text-sm text-grayMedium">Para: {giftCard.giftName || 'Não especificado'}</p>
                      </div>
                    </div>
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
          </div>
        )}
      </div>
    </div>
  );
}
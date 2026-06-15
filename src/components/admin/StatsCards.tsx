'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  FaGift,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaTrophy,
  FaArrowUp,
} from 'react-icons/fa';
import type { GiftCardStats } from '@/lib/giftcard-stats';

const money = (cents: number) =>
  `$${(cents / 100).toFixed(2)}`;

export default function StatsCards({
  stats,
}: {
  stats: GiftCardStats;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-gold to-yellow-600 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">
                Total Gift Cards
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.total}
              </p>
              <p className="text-yellow-200/70 text-xs mt-1 flex items-center gap-1">
                <FaArrowUp className="text-xs" />+
                {stats.thisMonthCount} este mês
              </p>
            </div>
            <FaGift className="text-4xl text-yellow-200 opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold text-sm font-medium">
                Total Vendido
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {money(stats.totalSold)}
              </p>
              <p className="text-grayMedium text-xs mt-1">
                Em gift cards
              </p>
            </div>
            <FaDollarSign className="text-4xl text-gold opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gold/80 to-yellow-700 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">
                Vendas este Mês
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {money(stats.thisMonthSales)}
              </p>
              <p className="text-yellow-200/70 text-xs mt-1">
                Em gift cards
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-yellow-200 opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold text-sm font-medium">
                Ticket Médio
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {money(stats.averageTicket)}
              </p>
              <p className="text-grayMedium text-xs mt-1">
                Por gift card
              </p>
            </div>
            <FaTrophy className="text-4xl text-gold opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gold/80 to-yellow-700 border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">
                Utilizados
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.redeemedCount}
              </p>
              <p className="text-yellow-200/70 text-xs mt-1">
                Serviço já realizado
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-yellow-200 opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-graphite to-gray-800 border border-gold/30 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold text-sm font-medium">
                A Utilizar
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.unredeemedCount}
              </p>
              <p className="text-grayMedium text-xs mt-1">
                Aguardando o cliente
              </p>
            </div>
            <FaClock className="text-4xl text-gold opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import {
  FaInstagram,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaTiktok,
  FaCommentAlt,
  FaHeart,
  FaCode,
} from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-background container text-gray-200 py-12 mt-16 mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center">
            <Image
              src="/images/flavia-logo.svg"
              alt="Flavia Guedes — Hair Studio"
              width={174}
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            {t('description1')}
          </p>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            {t('description2')}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gold">
            {t('contactTitle')}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center transition-colors hover:text-gold duration-300">
              <FaMapMarkerAlt className="mr-2" />
              <span>{t('address')}</span>
            </li>
            <li className="flex items-center transition-colors hover:text-gold duration-300">
              <FaPhoneAlt className="mr-2" />
              <a
                href="tel:+19544647349"
                className="hover:text-gold"
              >
                {t('phone')}
              </a>
            </li>

            <li className="flex items-center transition-colors hover:text-gold duration-300">
              <FaCommentAlt className="mr-2" />
              <a
                href="sms:+19544647349"
                className="hover:text-gold"
              >
                {t('phone')}
              </a>
            </li>
            <li className="flex items-center transition-colors hover:text-gold duration-300">
              <FaEnvelope className="mr-2" />
              <a
                href="mailto:guedesflavia@yahoo.com"
                className="hover:text-gold"
              >
                {t('email')}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gold">
            {t('socialTitle')}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center transition-colors hover:text-gold duration-300">
              <Link
                href="https://www.instagram.com/flaviaguedesstylist/"
                passHref
                target="_blank"
                className="flex items-center"
              >
                <FaInstagram className="mr-2" />
                <span>{t('instagram')}</span>
              </Link>
            </li>
            <li className="flex items-center transition-colors hover:text-gold duration-300">
              <Link
                href="https://www.tiktok.com/@guedesflavia6"
                passHref
                target="_blank"
                className="flex items-center"
              >
                <FaTiktok className="mr-2" />
                <span>{t('tiktok')}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mt-12">
        {/* Linha superior com shimmer animado */}
        <div className="absolute inset-x-0 top-0 h-[1px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent animate-shimmer" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-reverse" />
        </div>

        <div className="relative bg-gradient-to-b from-background via-graphite/60 to-background">
          {/* Padrão sutil de fundo */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8A04B' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative container mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-center w-full gap-4">
              {/* Desenvolvido com ❤ por WB */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-gray-400 font-light">
                    {t('developedWith')}
                  </span>
                  <div className="relative">
                    <FaHeart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold animate-pulse" />
                    <div className="absolute inset-0 blur-sm bg-gold/40 animate-pulse" />
                  </div>
                  <span className="text-gray-400 font-light">
                    {t('by')}
                  </span>
                </div>

                <Link
                  href="https://www.wbdigitalsolutions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative"
                >
                  <div className="hidden sm:block absolute -inset-2 bg-gradient-to-r from-gold/10 via-gold/25 to-gold/10 rounded-lg opacity-0 group-hover/link:opacity-100 blur-xl transition duration-500" />

                  <div className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gold/25 bg-gradient-to-r from-gold/10 to-graphite/40 group-hover/link:border-gold/60 group-hover/link:from-gold/20 group-hover/link:to-gold/10 transition-all duration-300">
                    <FaCode className="w-3 h-3 sm:w-4 sm:h-4 text-gold group-hover/link:rotate-12 transition-transform duration-300" />
                    <span className="text-xs sm:text-sm font-medium text-foreground transition-all duration-300">
                      WB Digital Solutions
                    </span>
                    <FiArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold/60 group-hover/link:text-gold transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </div>
                </Link>
              </div>

              {/* Copyright */}
              <div className="text-center">
                <div className="text-xs sm:text-sm flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                  <span className="text-gold">&copy;</span>
                  <span className="font-light text-gray-400">
                    {new Date().getFullYear()}
                  </span>
                  <span className="font-medium bg-gradient-to-r from-white to-gold bg-clip-text text-transparent">
                    Flavia Guedes
                  </span>
                  <span className="text-gold/60">•</span>
                  <span className="text-gray-500">
                    {t('rightsReserved')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

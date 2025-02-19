'use client';

import React from 'react';
import Image from 'next/image';
import {
  FaInstagram,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaTiktok,
} from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-background container text-gray-200 py-12 mt-16 mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna 1: Logo e Breve Descrição */}
        <div>
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <span className="text-2xl font-bold text-gold">
              Flavia Guedes
            </span>
          </div>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            {t('description1')}
          </p>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            {t('description2')}
          </p>
        </div>

        {/* Coluna 2: Informações de Contato */}
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

        {/* Coluna 3: Redes Sociais */}
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

      {/* Rodapé com direitos autorais */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center">
        <Link
          href="https://www.wbdigitalsolutions.com/"
          passHref
          target="_blank"
          className="transition-colors hover:text-gold duration-300"
        >
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()}{' '}
            {t('copyright')}
          </p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

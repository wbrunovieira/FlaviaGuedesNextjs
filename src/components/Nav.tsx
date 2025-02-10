'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import Flag from 'react-world-flags';
import ButtonAnimatedGradient from './ButtonAnimatedGradient';
import { FiRefreshCcw } from 'react-icons/fi';

gsap.registerPlugin(useGSAP);

export default function Nav() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const alternateLocale = locale === 'pt' ? 'en' : 'pt';

  const navContainer = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useGSAP(
    () => {
      if (navContainer.current) {
        gsap.from(navContainer.current, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      if (menuItemsRef.current.length > 0) {
        gsap.timeline().fromTo(
          menuItemsRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
          }
        );
      }
    },
    { scope: navContainer }
  );

  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(
        '.mobile-menu',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
        }
      );
    }
  }, [mobileMenuOpen]);

  return (
    <nav
      ref={navContainer}
      className="bg-background text-foreground p-4 shadow-md relative"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href={`/${locale}`}
          className="hover:scale-105 transition duration-200"
        >
          <span className="text-2xl font-bold cursor-pointer">
            {t('logo', { defaultValue: 'MyApp' })}
          </span>
        </Link>

        <ul className="hidden md:flex space-x-6">
          {['home', 'about', 'contact'].map(
            (item, index) => (
              <li
                key={item}
                ref={el => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                className="hover:text-gold transition duration-200"
              >
                <Link
                  href={`/${locale}/${
                    item !== 'home' ? item : ''
                  }`}
                  className="cursor-pointer"
                >
                  {t(item, { defaultValue: item })}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="flex items-center space-x-4">
          <ButtonAnimatedGradient
            size="sm"
            onClick={() =>
              (window.location.href = `/${alternateLocale}`)
            }
            className="relative group"
          >
            <span className="flex items-center space-x-2">
              <Flag
                code={locale === 'pt' ? 'US' : 'BR'}
                className="w-5 h-5 mr-2"
              />
              <FiRefreshCcw className="w-4 h-4 text-white opacity-80" />
            </span>

            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
              {locale === 'pt'
                ? 'Alterar idioma'
                : 'Switch language'}
            </span>
          </ButtonAnimatedGradient>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <HiOutlineX size={28} />
            ) : (
              <HiOutlineMenu size={28} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden mt-4 bg-background p-4 rounded-lg shadow-lg">
          <ul className="flex flex-col space-y-3">
            {['home', 'about', 'contact'].map(
              (item, index) => (
                <li
                  key={item}
                  ref={el => {
                    if (el)
                      menuItemsRef.current[index] = el;
                  }}
                  className="hover:text-gold transition duration-200"
                >
                  <Link
                    href={`/${locale}/${
                      item !== 'home' ? item : ''
                    }`}
                    className="cursor-pointer block text-lg"
                  >
                    {t(item, { defaultValue: item })}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

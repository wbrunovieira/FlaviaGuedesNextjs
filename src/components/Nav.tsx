'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Flag from 'react-world-flags';
import ButtonAnimatedGradient from './ButtonAnimatedGradient';
import { FiRefreshCcw } from 'react-icons/fi';
import ToggleButton from './ToggleButton';

export default function Nav() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const alternateLocale = locale === 'pt' ? 'en' : 'pt';

  const navContainer = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const menuItems = [
    { name: 'home', href: '#top' },
    { name: 'products', href: '#products' },
    { name: 'services', href: '#services' },
    { name: 'location', href: '#location' },
    { name: 'about', href: '#about' },
    { name: 'gallery', href: '#gallery' },
  ];

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
      id="top" // âncora para o topo da página
      className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md text-foreground p-4 shadow-md z-50"
    >
      <div className="container mx-auto flex justify-between items-center w-full">
        <Link
          href="#top"
          className="hover:scale-105 transition duration-200"
        >
          <span className="text-2xl font-bold cursor-pointer">
            {t('logo', { defaultValue: 'MyApp' })}
          </span>
        </Link>

        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item, index) => (
            <li
              key={item.name}
              ref={el => {
                if (el) menuItemsRef.current[index] = el;
              }}
              className="hover:text-gold transition duration-200"
            >
              <Link
                href={item.href}
                className="cursor-pointer"
              >
                {t(item.name, { defaultValue: item.name })}
              </Link>
            </li>
          ))}
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
          </ButtonAnimatedGradient>

          <ToggleButton
            checked={mobileMenuOpen}
            onChange={() =>
              setMobileMenuOpen(prev => !prev)
            }
          />
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden mt-4 bg-background p-4 rounded-lg shadow-lg w-full">
          <ul className="flex flex-col space-y-3 w-full">
            {menuItems.map((item, index) => (
              <li
                key={item.name}
                ref={el => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                className="hover:text-gold transition duration-200"
              >
                <Link
                  href={item.href}
                  className="cursor-pointer block text-lg"
                >
                  {t(item.name, {
                    defaultValue: item.name,
                  })}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

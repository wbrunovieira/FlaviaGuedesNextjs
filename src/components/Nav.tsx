'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ButtonAnimatedGradient from './ButtonAnimatedGradient';
import ToggleButton from './ToggleButton';

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
          menuItemsRef.current.slice(0, 3),
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.15,
            onComplete: () => {
              menuItemsRef.current
                .slice(0, 3)
                .forEach(el => {
                  gsap.set(el, { clearProps: 'all' });
                });
            },
          }
        );
      }
    },
    { scope: navContainer }
  );

  useEffect(() => {
    if (mobileMenuOpen) {
      const mobileItems = menuItemsRef.current.slice(3, 6);
      gsap.fromTo(
        mobileItems,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.15,
        }
      );
    }
  }, [mobileMenuOpen]);

  const registerMenuItem = (
    el: HTMLLIElement | null,
    index: number
  ) => {
    if (el) {
      menuItemsRef.current[index] = el;
    }
  };

  const switchLanguage = () => {
    window.location.href = `/${alternateLocale}`;
  };

  return (
    <nav
      ref={navContainer}
      className="bg-gray-800 text-white p-4 shadow-md"
      aria-label={t('navigationLabel', {
        defaultValue: 'Main navigation',
      })}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-end justify-between">
        <div className="flex items-end space-x-6 ">
          <Link
            href={`/${locale}`}
            className="hover:scale-105 transition duration-200"
          >
            <span
              className="text-2xl font-bold cursor-pointer "
              aria-label={t('logoAria', {
                defaultValue: 'Home',
              })}
            >
              {t('logo', { defaultValue: 'MyApp' })}
            </span>
          </Link>

          <ul
            className="hidden md:flex space-x-4"
            role="menu"
          >
            <li
              role="none"
              ref={el => registerMenuItem(el, 0)}
              className="hover:text-gray-300 hover:scale-105 transition duration-200"
            >
              <Link href={`/${locale}`}>
                <span
                  role="menuitem"
                  className="cursor-pointer"
                >
                  {t('home', { defaultValue: 'Home' })}
                </span>
              </Link>
            </li>
            <li
              role="none"
              ref={el => registerMenuItem(el, 1)}
              className="hover:text-gray-300 hover:scale-105 transition duration-200"
            >
              <Link href={`/${locale}/about`}>
                <span
                  role="menuitem"
                  className="cursor-pointer"
                >
                  {t('about', { defaultValue: 'About' })}
                </span>
              </Link>
            </li>
            <li
              role="none"
              ref={el => registerMenuItem(el, 2)}
              className="hover:text-gray-300  hover:scale-105 transition duration-200"
            >
              <Link href={`/${locale}/contact`}>
                <span
                  role="menuitem"
                  className="cursor-pointer"
                >
                  {t('contact', {
                    defaultValue: 'Contact',
                  })}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-4 md:mt-0 flex items-end space-x-4">
          <ButtonAnimatedGradient
            text={t('switchLanguage', {
              defaultValue: `Switch to ${alternateLocale.toUpperCase()}`,
            })}
            onClick={switchLanguage}
          />

          <ToggleButton
            checked={mobileMenuOpen}
            onChange={() =>
              setMobileMenuOpen(prev => !prev)
            }
          />
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4">
          <ul
            className="flex flex-col space-y-2"
            role="menu"
          >
            <li
              role="none"
              ref={el => registerMenuItem(el, 3)}
              className="hover:text-gray-300 transition duration-200"
            >
              <Link href={`/${locale}`}>
                <span
                  role="menuitem"
                  className="cursor-pointer"
                >
                  {t('home', { defaultValue: 'Home' })}
                </span>
              </Link>
            </li>
            <li
              role="none"
              ref={el => registerMenuItem(el, 4)}
              className="hover:text-gray-300 transition duration-200"
            >
              <Link href={`/${locale}/about`}>
                <span
                  role="menuitem"
                  className="cursor-pointer"
                >
                  {t('about', { defaultValue: 'About' })}
                </span>
              </Link>
            </li>
            <li
              role="none"
              ref={el => registerMenuItem(el, 5)}
              className="hover:text-gray-300 transition duration-200"
            >
              <Link href={`/${locale}/contact`}>
                <span
                  role="menuitem"
                  className="cursor-pointer"
                >
                  {t('contact', {
                    defaultValue: 'Contact',
                  })}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

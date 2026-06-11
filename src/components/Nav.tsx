'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ButtonAnimatedGradient from './ButtonAnimatedGradient';
import { FiRefreshCcw } from 'react-icons/fi';
import { FaRegCalendarCheck } from 'react-icons/fa';
import ToggleButton from './ToggleButton';

const BOOKING_URL =
  'https://app.salonrunner.com/customer/home/ifiercebeautylounge/index.htm';

export default function Nav() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const alternateLocale = locale === 'pt' ? 'en' : 'pt';
  const pathname = usePathname();
  const isStoryPage = pathname?.endsWith('/about') ?? false;

  const navContainer = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] =
    useState('top');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // The "top" anchor lives on the fixed nav itself, so the
      // IntersectionObserver never sees it — detect it by scroll position.
      // On the story page, "Sobre" stays highlighted instead.
      if (window.scrollY < 300) {
        setActiveSection(isStoryPage ? 'about' : 'top');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true,
    });
    return () =>
      window.removeEventListener('scroll', onScroll);
  }, [isStoryPage]);

  useEffect(() => {
    const ids = [
      'top',
      'products',
      'services',
      'location',
      'about',
      'gallery',
      'giftcard',
      'promotions',
    ];
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            window.scrollY >= 300
          ) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const menuItems = [
    { name: 'home', href: '#top' },
    { name: 'products', href: '#products' },
    { name: 'services', href: '#services' },
    { name: 'location', href: '#location' },
    { name: 'about', href: '#about' },
    { name: 'gallery', href: '#gallery' },
    { name: 'giftcard', href: '#giftcard' },
    { name: 'promotions', href: '#promotions' },
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
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
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

  const handleMobileMenuClose = () => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          setMobileMenuOpen(false);
        },
      });
    }
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      handleMobileMenuClose();
    } else {
      setMobileMenuOpen(true);
    }
  };

  return (
    <nav
      ref={navContainer}
      id="top"
      className={`fixed top-0 left-0 w-full text-foreground px-4 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md py-1.5 shadow-[0_10px_30px_-12px_rgba(200,160,75,0.3)]'
          : 'bg-background/50 backdrop-blur-sm py-2.5'
      }`}
    >
      <div
        className={`absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-50'
        }`}
        aria-hidden
      />
      <div className="container mx-auto flex justify-between items-center w-full">
        <Link
          href={`/${locale}#top`}
          className="hover:scale-105 transition duration-200"
          aria-label={t('logoAria')}
        >
          <Image
            src="/images/flavia-logo.svg"
            alt="Flavia Guedes — Hair Studio"
            width={290}
            height={100}
            priority
            className={`w-auto cursor-pointer transition-all duration-500 ${
              scrolled
                ? 'h-12 sm:h-14'
                : 'h-14 sm:h-[4.5rem]'
            }`}
          />
        </Link>

        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item, index) => (
            <li
              key={item.name}
              ref={el => {
                if (el) menuItemsRef.current[index] = el;
              }}
              className="hover:text-gold transition duration-200 text-sm"
            >
              <Link
                href={`/${locale}${item.href}`}
                className={`cursor-pointer nav-link ${
                  activeSection === item.href.slice(1)
                    ? 'text-gold nav-link-active'
                    : ''
                }`}
              >
                {t(item.name)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-background shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-opacity-90 hover:shadow-gold/40"
          >
            <FaRegCalendarCheck className="text-sm" />
            {t('bookNow')}
          </a>
          <ButtonAnimatedGradient
            size="sm"
            onClick={() =>
              (window.location.href = `/${alternateLocale}`)
            }
            className="relative group"
          >
            <span className="flex items-center space-x-2">
              <Image
                src={
                  alternateLocale === 'pt'
                    ? '/icons/brazil.svg'
                    : '/icons/united.svg'
                }
                width={20}
                height={12}
                alt="Flag"
                priority
              />
              <FiRefreshCcw className="w-4 h-4 text-white opacity-80" />
            </span>
          </ButtonAnimatedGradient>

          <ToggleButton
            checked={mobileMenuOpen}
            onChange={toggleMobileMenu}
          />
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="mobile-menu md:hidden mt-4 bg-background p-4 rounded-lg shadow-lg w-full"
        >
          <ul className="flex flex-col space-y-3 w-full bg-black/55">
            {menuItems.map((item, index) => (
              <li
                key={item.name}
                ref={el => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                className="hover:text-gold transition duration-200 text-right"
              >
                <Link
                  href={`/${locale}${item.href}`}
                  onClick={handleMobileMenuClose}
                  className="cursor-pointer block"
                >
                  {t(item.name, {
                    defaultValue: item.name,
                  })}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMobileMenuClose}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-background transition-all duration-300 hover:bg-opacity-90"
              >
                <FaRegCalendarCheck />
                {t('bookNow')}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaPhoneAlt,
  FaCommentAlt,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaGlobe,
  FaGift,
  FaRegCalendarCheck,
  FaUserPlus,
  FaHeart,
} from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';

const CARD_URL = 'https://card.flaviaguedes.com';
const BOOKING_URL =
  'https://app.salonrunner.com/customer/home/ifiercebeautylounge/index.htm';

type Lang = 'en' | 'pt';

const strings = {
  en: {
    role: 'Hair Stylist & Colorist',
    salonLine: 'iFierce Beauty Lounge · Fort Lauderdale, FL',
    welcome:
      "Good to see you here! Save my contact, book your appointment and let's create your best hair together. ✨",
    book: 'Book an Appointment',
    save: 'Save Contact',
    directContact: 'Direct contact',
    phone: 'Phone',
    sms: 'Text message',
    email: 'Email',
    social: 'Social & web',
    website: 'Website',
    gift: 'Gift Cards',
    giftValue: 'Give someone a special treat',
    salonLabel: 'Salon',
    services: 'Signature services',
    servicesList: [
      'Balayage & Highlights',
      'Color & Gloss',
      'Keratin Treatment',
      'Precision Haircuts',
      'Conditioning & Care',
    ],
    scan: 'Scan to share',
    developedWith: 'Developed with',
    by: 'by',
  },
  pt: {
    role: 'Hair Stylist & Colorista',
    salonLine: 'iFierce Beauty Lounge · Fort Lauderdale, FL',
    welcome:
      'Que bom te ver por aqui! Salve meu contato, agende seu horário e vamos criar juntas o seu melhor cabelo. ✨',
    book: 'Agendar Horário',
    save: 'Salvar Contato',
    directContact: 'Contato direto',
    phone: 'Telefone',
    sms: 'Mensagem de texto',
    email: 'E-mail',
    social: 'Redes & web',
    website: 'Site',
    gift: 'Gift Cards',
    giftValue: 'Presenteie alguém especial',
    salonLabel: 'Salão',
    services: 'Serviços principais',
    servicesList: [
      'Balayage & Mechas',
      'Coloração & Gloss',
      'Queratina',
      'Cortes de Precisão',
      'Tratamentos & Hidratação',
    ],
    scan: 'Escaneie para compartilhar',
    developedWith: 'Desenvolvido com',
    by: 'por',
  },
} as const;

type ContactRowProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
};

function ContactRow({
  href,
  icon,
  label,
  value,
  external,
}: ContactRowProps) {
  return (
    <a
      href={href}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className="group flex items-center gap-4 rounded-xl border border-gold/15 bg-gradient-to-r from-graphite/80 to-black/40 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_10px_30px_-15px_rgba(200,160,75,0.4)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold/20">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.25em] text-gold/60">
          {label}
        </span>
        <span className="block truncate text-sm font-medium text-white">
          {value}
        </span>
      </span>
      <FiArrowUpRight className="shrink-0 text-gold/40 transition-all duration-300 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

export default function DigitalCard() {
  const [lang, setLang] = useState<Lang>('en');
  const t = strings[lang];

  useEffect(() => {
    if (navigator.language?.toLowerCase().startsWith('pt')) {
      setLang('pt');
    }
  }, []);

  const langButton = (
    code: Lang,
    flag: string,
    label: string
  ) => (
    <button
      onClick={() => setLang(code)}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
        lang === code
          ? 'border-gold bg-gold/15 text-gold'
          : 'border-gold/20 text-gray-400 hover:border-gold/50 hover:text-gold'
      }`}
      aria-pressed={lang === code}
    >
      <Image
        src={flag}
        width={16}
        height={10}
        alt={label}
      />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="bg-atmosphere" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      <main className="relative z-10 mx-auto flex max-w-md flex-col gap-8 px-5 py-8">
        {/* Idiomas */}
        <div className="flex justify-end gap-2">
          {langButton('pt', '/icons/brazil.svg', 'PT')}
          {langButton('en', '/icons/united.svg', 'EN')}
        </div>

        {/* Header */}
        <header className="text-center">
          <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-gold via-yellow-700 to-gold p-[3px] shadow-lg shadow-gold/25">
            <Image
              src="/images/flavia.webp"
              alt="Flavia Guedes"
              width={256}
              height={256}
              priority
              className="h-full w-full rounded-full bg-black object-cover object-[50%_22%]"
            />
          </div>
          <Image
            src="/images/flavia-logo.svg"
            alt="Flavia Guedes — Hair Studio"
            width={348}
            height={120}
            priority
            className="mx-auto mt-5 h-28 w-auto"
          />
          <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-gold/70">
            {t.role}
          </p>
          <p className="mt-1 text-sm text-grayMedium">
            {t.salonLine}
          </p>

          <div className="mx-auto my-6 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <p className="text-sm leading-relaxed text-gray-300">
            {t.welcome}
          </p>
        </header>

        {/* Ações principais */}
        <div className="flex flex-col gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-background shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-opacity-90 hover:shadow-gold/40"
          >
            <FaRegCalendarCheck />
            {t.book}
          </a>
          <a
            href="/flavia-guedes.vcf"
            download
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-transparent px-6 py-3.5 font-semibold text-gold transition-all duration-300 hover:bg-gold/10 hover:border-gold"
          >
            <FaUserPlus />
            {t.save}
          </a>
        </div>

        {/* Contato direto */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-[11px] uppercase tracking-[0.3em] text-gold/60">
            {t.directContact}
          </h2>
          <ContactRow
            href="tel:+19544647349"
            icon={<FaPhoneAlt className="text-sm" />}
            label={t.phone}
            value="+1 (954) 464-7349"
          />
          <ContactRow
            href="sms:+19544647349"
            icon={<FaCommentAlt className="text-sm" />}
            label={t.sms}
            value="+1 (954) 464-7349"
          />
          <ContactRow
            href="mailto:guedesflavia@yahoo.com"
            icon={<FaEnvelope className="text-sm" />}
            label={t.email}
            value="guedesflavia@yahoo.com"
          />
        </section>

        {/* Redes & web */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-[11px] uppercase tracking-[0.3em] text-gold/60">
            {t.social}
          </h2>
          <ContactRow
            href="https://www.instagram.com/flaviaguedesstylist/"
            icon={<FaInstagram className="text-base" />}
            label="Instagram"
            value="@flaviaguedesstylist"
            external
          />
          <ContactRow
            href="https://www.tiktok.com/@guedesflavia6"
            icon={<FaTiktok className="text-sm" />}
            label="TikTok"
            value="@guedesflavia6"
            external
          />
          <ContactRow
            href={`https://flaviaguedes.com/${lang}`}
            icon={<FaGlobe className="text-sm" />}
            label={t.website}
            value="flaviaguedes.com"
            external
          />
          <ContactRow
            href={`https://flaviaguedes.com/${lang}#giftcard`}
            icon={<FaGift className="text-sm" />}
            label={t.gift}
            value={t.giftValue}
            external
          />
          <ContactRow
            href="https://maps.google.com/?q=2685+E+Oakland+Park+Blvd,+Fort+Lauderdale,+FL+33306"
            icon={<FaMapMarkerAlt className="text-sm" />}
            label={t.salonLabel}
            value="2685 E Oakland Park Blvd, Fort Lauderdale"
            external
          />
        </section>

        {/* Serviços */}
        <section className="text-center">
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-gold/60">
            {t.services}
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {t.servicesList.map(service => (
              <span
                key={service}
                className="rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-xs text-gray-200"
              >
                {service}
              </span>
            ))}
          </div>
        </section>

        {/* QR code */}
        <footer className="flex flex-col items-center gap-3 pb-4 text-center">
          <div className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="mt-3 rounded-xl border border-gold/30 bg-white p-3">
            <QRCodeSVG
              value={CARD_URL}
              size={132}
              fgColor="#0A0A0A"
              bgColor="#FFFFFF"
            />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold/60">
            {t.scan}
          </p>
          <p className="text-sm text-grayMedium">
            card.flaviaguedes.com
          </p>

          <div className="mt-6 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span>{t.developedWith}</span>
            <FaHeart className="text-[9px] text-gold animate-pulse" />
            <span>{t.by}</span>
            <a
              href="https://www.wbdigitalsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold/80 transition-colors duration-300 hover:text-gold"
            >
              WB Digital Solutions
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

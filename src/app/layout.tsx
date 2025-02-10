// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Merriweather, Work_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Flavia Guedes',
  description: '',
};

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-work-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${merriweather.variable} ${workSans.variable}`}
    >
      <head>
        <title>Flavia Guedes</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

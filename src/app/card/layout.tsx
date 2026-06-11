import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import '../globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://card.flaviaguedes.com'),
  title: 'Flavia Guedes — Digital Card',
  description:
    'Flavia Guedes — Hair Stylist & Colorist at iFierce Beauty Lounge, Fort Lauderdale. Save the contact, book an appointment and follow on social media.',
  openGraph: {
    type: 'profile',
    title: 'Flavia Guedes — Digital Card',
    description:
      'Hair Stylist & Colorist at iFierce Beauty Lounge, Fort Lauderdale.',
    images: [{ url: '/images/og-image.jpg' }],
  },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${fraunces.variable}`}
    >
      <body className={workSans.className}>
        {children}
      </body>
    </html>
  );
}

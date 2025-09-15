import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import '../globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin - Flavia Guedes',
  description: 'Admin Dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={workSans.variable}>
      <body className={workSans.className}>
        {children}
      </body>
    </html>
  );
}
// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flavia Guedes',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Aqui não definimos "lang", pois o layout dinâmico ([locale]) irá definir o atributo correto.
    <html>
      <head>
        <title>Flavia Guedes</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

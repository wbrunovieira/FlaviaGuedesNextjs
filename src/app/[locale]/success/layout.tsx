import type { Metadata } from 'next';

// Transactional page — keep out of search index
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

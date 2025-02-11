// src/app/[locale]/page.tsx

import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import ProductsShowcase from '@/components/Products';

export default function Index() {
  return (
    <div className="w-full min-h-screen">
      <Nav />
      <Hero />
      <ProductsShowcase />
    </div>
  );
}

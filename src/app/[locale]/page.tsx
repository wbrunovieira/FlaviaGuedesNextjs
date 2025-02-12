// src/app/[locale]/page.tsx

import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import ProductsShowcase from '@/components/Products';
import Location from '@/components/Location';

export default function Index() {
  return (
    <div className="bg-black w-full min-h-screen">
      <Nav />
      <Hero />
      <ProductsShowcase />
      <Location />
    </div>
  );
}

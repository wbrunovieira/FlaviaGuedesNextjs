// src/app/[locale]/page.tsx

import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import ProductsShowcase from '@/components/Products';
import Location from '@/components/Location';
import About from '@/components/About';

import Services from '@/components/Service';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import GiftCardPurchase from '@/components/GiftCardPurchase';

export default function Index() {
  return (
    <div className="bg-black w-full min-h-screen">
      <Nav />
      <Hero />
      <ProductsShowcase />
      <Location />
      <About />

      <Services />
      <Gallery />
      <GiftCardPurchase />
      <Footer />
    </div>
  );
}

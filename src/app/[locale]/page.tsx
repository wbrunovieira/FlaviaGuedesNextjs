// src/app/[locale]/page.tsx

import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import ProductsShowcase from '@/components/Products';
import Location from '@/components/Location';
import About from '@/components/About';

import Services from '@/components/Service';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import GiftCardPurchaseSimple from '@/components/GiftCardPurchaseSimple';
import BeautyBankPurchase from '@/components/BeautyBankPurchase';
import Promotions from '@/components/Promotions';
import SectionReveal from '@/components/ui/SectionReveal';
import SectionDivider from '@/components/ui/SectionDivider';
import HashScrollFix from '@/components/ui/HashScrollFix';

export default function Index() {
  return (
    <div className="bg-black w-full min-h-screen relative">
      <HashScrollFix />
      <div className="bg-atmosphere" aria-hidden />
      <div className="grain-overlay" aria-hidden />
      <main className="relative z-10">
        <Nav />
        <Hero />
        <SectionReveal>
          <ProductsShowcase />
        </SectionReveal>
        <SectionReveal>
          <Location />
        </SectionReveal>
        <SectionDivider />
        <SectionReveal>
          <About />
        </SectionReveal>
        <SectionReveal>
          <Services />
        </SectionReveal>
        <SectionDivider />
        <SectionReveal>
          <Gallery />
        </SectionReveal>
        <SectionReveal>
          <GiftCardPurchaseSimple />
        </SectionReveal>
        <SectionDivider />
        <SectionReveal>
          <BeautyBankPurchase />
        </SectionReveal>
        <SectionDivider />
        <SectionReveal>
          <Promotions />
        </SectionReveal>
        <Footer />
      </main>
    </div>
  );
}

'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Carousel } from '@/components/ui/carousel';

type ProductsShowcaseProps = {
  id?: string;
};

const products = [
  {
    brand: 'R+Co',
    title: 'rcoTitle',
    description: 'rcoDescription',
    image: '/images/R+co.jpg',
  },
  {
    brand: 'K18',
    title: 'k18Title',
    description: 'k18Description',
    image: '/images/k18.jpg',
  },
  {
    brand: 'Color Wow',
    title: 'colorWowTitle',
    description: 'colorWowDescription',
    image: '/images/wow.jpg',
  },
];

export default function ProductsShowcase({
  id = 'products',
}: ProductsShowcaseProps) {
  const t = useTranslations('Products');
  const productsRef = useRef(null);

  useGSAP(() => {
    gsap.from(productsRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
    });
  }, []);

  return (
    <section
      id={id}
      ref={productsRef}
      className="py-16 px-6 md:px-12 lg:px-20 text-white mt-32"
      style={{
        background:
          'linear-gradient(to right, black 40%, #C8A04B 48%, #C8A04B 52%, black 60%)',
      }}
    >
      <div className="bg-black bg-opacity-80 p-16 rounded-lg">
        <h2 className="text-4xl font-bold text-center mb-6">
          {t('premiumHaircareProducts')}
        </h2>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-10">
          {t('premiumHaircareSubtitle')}
        </p>

        <div className="relative w-full flex justify-center mb-12">
          <div className="h-[2px] w-1/3 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        </div>
      </div>

      <Carousel
        slides={products.map(product => ({
          ...product,
          title: t(product.title),
          description: t(product.description),
        }))}
      />

      <div className="relative w-full flex justify-center mt-12">
        <div className="h-[2px] w-1/3 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>
    </section>
  );
}

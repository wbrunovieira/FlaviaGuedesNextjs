'use client';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  brand: string;
  title: string;
  description: string;
  image: string;
}

interface CarouselProps {
  slides: Product[];
}

export function Carousel({ slides }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = Array.from(container.children);
      children.forEach((child, index) => {
        const rect = (
          child as HTMLElement
        ).getBoundingClientRect();
        const inView =
          rect.left >= 0 &&
          rect.right <=
            (window.innerWidth ||
              document.documentElement.clientWidth);
        if (inView && window.innerWidth < 768) {
          setCurrentIndex(index);
        }
      });
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex(
      prevIndex => (prevIndex + 1) % slideCount
    );
    scrollToCurrentSlide((currentIndex + 1) % slideCount);
  };

  const handlePrev = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + slideCount) % slideCount
    );
    scrollToCurrentSlide(
      (currentIndex - 1 + slideCount) % slideCount
    );
  };

  const scrollToCurrentSlide = (index: number) => {
    if (containerRef.current) {
      const slide = containerRef.current.children[
        index
      ] as HTMLElement;
      slide.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden p-4">
      <div
        ref={containerRef}
        className="flex w-full overflow-x-auto space-x-6 p-4 snap-x snap-mandatory md:justify-center md:overflow-hidden"
      >
        {slides.map((product, index) => (
          <div
            key={index}
            className={`relative bg-gold rounded-lg overflow-hidden shadow-lg
               min-w-[300px] max-w-[400px] transition-transform duration-300
               hover:scale-105 hover:shadow-xl snap-center
               ${
                 index === currentIndex
                   ? 'brightness-110 md:brightness-100'
                   : 'brightness-75 md:brightness-100'
               }
              `}
          >
            <div
              className={`absolute inset-0 bg-black bg-opacity-80 transition-opacity duration-300
                 md:hover:opacity-0
                 ${
                   index === currentIndex
                     ? 'opacity-0 md:opacity-100'
                     : 'opacity-100'
                 }
                `}
            />
            <Image
              src={product.image}
              alt={product.brand}
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 relative z-10">
              <h3 className="text-2xl font-semibold mb-2 text-background">
                {product.brand}
              </h3>
              <div className="h-[2px] w-1/3 bg-gradient-to-r from-transparent via-background to-transparent" />
              <p className="text-background mb-4 mt-2">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 mt-4 md:hidden">
        <button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center bg-neutral-200 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200"
        >
          <IconArrowNarrowRight className="text-neutral-600 rotate-180" />
        </button>

        <button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center bg-neutral-200 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200"
        >
          <IconArrowNarrowRight className="text-neutral-600" />
        </button>
      </div>
    </div>
  );
}

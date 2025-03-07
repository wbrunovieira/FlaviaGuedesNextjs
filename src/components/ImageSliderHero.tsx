'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Definição da interface para as props do MemoizedSlide
interface MemoizedSlideProps {
  src: string;
}

const MemoizedSlide = memo(function MemoizedSlide({
  src,
}: MemoizedSlideProps) {
  return (
    <motion.div
      key={src}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0"
    >
      <Image
        src={src}
        alt="Hairstyle"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </motion.div>
  );
});

const images: string[] = [
  '/images/flavia2.webp',
  '/images/hair1.png',
  '/images/hair2.png',
  '/images/ifierce2.png',
];

const ImageSliderHero: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [hasLoadedFirstImage, setHasLoadedFirstImage] =
    useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(
        prevIndex => (prevIndex + 1) % images.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-2xl">
      {!hasLoadedFirstImage && (
        <Image
          src={images[0]}
          alt="Hairstyle"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          onLoad={() => setHasLoadedFirstImage(true)}
        />
      )}

      {hasLoadedFirstImage && (
        <AnimatePresence mode="wait">
          <MemoizedSlide src={images[index]} />
        </AnimatePresence>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};

export default memo(ImageSliderHero);

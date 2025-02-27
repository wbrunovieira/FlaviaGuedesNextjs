'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/images/flavia2.png',
  '/images/hair1.png',
  '/images/hair2.png',
  '/images/ifierce2.png',
];

export default function ImageSliderHero() {
  const [index, setIndex] = useState(0);

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
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt="Hairstyle"
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
}

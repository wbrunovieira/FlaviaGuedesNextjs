'use client';
import React from 'react';
import { SparklesCore } from './ui/sparkles';

export function SparklesHero() {
  return (
    <div className="h-[3rem] w-full flex flex-col items-center justify-center overflow-hidden mt-2">
      <div className="w-[40rem] max-w-full h-40 relative">
        <div className="absolute left-[12.5%] top-0 bg-gradient-to-r from-transparent via-gold to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute left-[12.5%] top-0 bg-gradient-to-r from-transparent via-gold to-transparent h-px w-3/4" />
        <div className="absolute left-[37.5%] top-0 bg-gradient-to-r from-transparent via-gold to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute left-[37.5%] top-0 bg-gradient-to-r from-transparent via-gold to-transparent h-px w-1/4" />

        {/* Partículas com fade nas bordas via máscara — sem fundo sólido,
            fica transparente sobre qualquer cor de fundo */}
        <div className="w-full h-1/3 [mask-image:radial-gradient(350px_200px_at_top,white_20%,transparent)]">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>
    </div>
  );
}

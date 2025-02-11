'use client';
import React, { useId } from 'react';
import { useEffect, useState } from 'react';
import Particles, {
  initParticlesEngine,
} from '@tsparticles/react';
import type { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { cn } from '@/lib/utils';
import { motion, useAnimation } from 'framer-motion';

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize = 0.5,
    maxSize = 2,
    speed = 0.3,
    particleColor = '#ffffff',
    particleDensity = 50,
  } = props;

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const controls = useAnimation();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      });
    }
  };

  const generatedId = useId();

  return (
    <motion.div
      animate={controls}
      className={cn('opacity-0', className)}
    >
      {init && (
        <Particles
          id={id || generatedId}
          className={cn('h-full w-full')}
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background || '#0d47a1',
              },
            },
            fullScreen: {
              enable: false,
              zIndex: 1,
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: 'push',
                },
                onHover: {
                  enable: false,
                  mode: 'repulse',
                },
                resize: { enable: true },
              },
              modes: {
                push: {
                  quantity: 2,
                },
                repulse: {
                  distance: 150,
                  duration: 0.4,
                },
              },
            },
            particles: {
              move: {
                enable: true,
                speed,
                direction: 'none',
                outModes: {
                  default: 'out',
                },
              },
              color: {
                value: particleColor,
              },
              number: {
                value: particleDensity,
                density: {
                  enable: true,
                  width: 800,
                  height: 800,
                },
              },
              opacity: {
                value: {
                  min: 0.2,
                  max: 0.8,
                },
                animation: {
                  enable: true,
                  speed: 0.5,
                  startValue: 'random',
                },
              },
              size: {
                value: {
                  min: minSize,
                  max: maxSize,
                },
                animation: {
                  enable: true,
                  speed: 1,
                  startValue: 'random',
                },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};

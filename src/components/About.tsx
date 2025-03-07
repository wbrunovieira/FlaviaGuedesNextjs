'use client';

import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type AboutProps = {
  id?: string;
};

function splitParagraphIntoSpans(text: string) {
  return text.split(' ').map((word, idx) => (
    <span
      key={`${word}-${idx}`}
      style={{
        opacity: 0,
        filter: 'blur(10px)',
        marginRight: '4px',
      }}
    >
      {word}
    </span>
  ));
}

function getTitleSpans(title1: string, title2: string) {
  return (
    <>
      <span className="text-white">{title1}</span>
      <br />
      <span className="text-gold">{title2}</span>
    </>
  );
}

export default function About({
  id = 'about',
}: AboutProps) {
  const t = useTranslations('About');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<HTMLDivElement[]>([]);

  const title1 = t('title1');
  const title2 = t('title2');

  const paragraphs = useMemo(
    () => [
      t('paragraph1'),
      t('paragraph2'),
      t('paragraph3'),
      t('paragraph4'),
      t('motto'),
    ],
    [t]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.from(containerRef.current, {
        autoAlpha: 0,
        y: 30,
        duration: 1,
      });

      if (titleRef.current) {
        const titleSpans =
          titleRef.current.querySelectorAll('span');
        tl.set(titleRef.current, { opacity: 1 });
        tl.fromTo(
          titleSpans,
          { opacity: 0, filter: 'blur(10px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.1,
          },
          '+=0.3'
        );
      }

      paragraphs.forEach((_, index) => {
        const paragraphEl = paragraphRefs.current[index];
        if (!paragraphEl) return;

        tl.set(paragraphEl, { opacity: 1 });
        const spans = paragraphEl.querySelectorAll('span');

        tl.fromTo(
          spans,
          { opacity: 0, filter: 'blur(10px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.1,
          },
          '+=0.3'
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [paragraphs]);

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative container w-full py-16 px-6 md:px-12 lg:px-20 text-white overflow-hidden mx-auto mt-32"
      style={{
        background: `
      radial-gradient(circle at top right, rgba(31, 31, 31, 0.7) 0%, transparent 60%),
      radial-gradient(circle at bottom left, rgba(31, 31, 31, 0.7) 0%, transparent 40%),
      black
    `,
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="w-full md:w-2/3 flex justify-center md:justify-start">
          <div className="relative w-full h-[350px] md:h-[500px] max-w-md bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <Image
              src="/images/flavia2.png"
              alt="Flavia Guedes"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full  flex flex-col items-center md:items-start text-center md:text-left space-y-8">
          <h2
            ref={titleRef}
            style={{ opacity: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug whitespace-normal z-50"
          >
            {getTitleSpans(title1, title2)}
          </h2>

          <div className="w-full max-w-xl mx-auto md:mx-0 z-50 ">
            {paragraphs.map((text, index) => (
              <div
                key={index}
                style={{ opacity: 0 }}
                ref={el => {
                  if (el) paragraphRefs.current[index] = el;
                }}
                className="w-full"
              >
                <p
                  className={`
            text-left text-base sm:text-lg md:text-lg leading-5
            whitespace-normal max-w-full z-50
            ${
              index === paragraphs.length - 1
                ? 'text-gold font-semibold'
                : 'text-white'
            }
          `}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  {splitParagraphIntoSpans(text)}
                </p>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

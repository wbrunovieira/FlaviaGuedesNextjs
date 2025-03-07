'use client';

import React from 'react';
import Image from 'next/image';
import PhotoAlbum, {
  Photo,
  RenderImageProps,
  RenderImageContext,
} from 'react-photo-album';
import 'react-photo-album/styles.css';

import { useTranslations } from 'next-intl';

interface CustomPhoto extends Photo {
  blurDataURL?: string;
}

type GallerySectionProps = {
  id?: string;
};

const photos: CustomPhoto[] = [
  {
    src: '/images/hair1.png',
    width: 1200,
    height: 800,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/hair1.png',
  },
  {
    src: '/images/hair2.png',
    width: 800,
    height: 1200,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/hair2.png',
  },
  {
    src: '/images/image1.jpeg',
    width: 1000,
    height: 750,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image1.jpeg',
  },
  {
    src: '/images/image3.png',
    width: 750,
    height: 1000,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image3.png',
  },
  {
    src: '/images/image4.jpeg',
    width: 600,
    height: 600,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image4.jpeg',
  },
  {
    src: '/images/image5.jpeg',
    width: 800,
    height: 600,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image5.jpeg',
  },
  {
    src: '/images/image6.jpeg',
    width: 900,
    height: 700,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image6.jpeg',
  },
  {
    src: '/images/image7.jpeg',
    width: 700,
    height: 500,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image7.jpeg',
  },
  {
    src: '/images/image8.jpeg',
    width: 1200,
    height: 800,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image8.jpeg',
  },
  {
    src: '/images/image9.jpeg',
    width: 600,
    height: 900,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/image9.jpeg',
  },
  {
    src: '/images/IMG_1425.jpg',
    width: 1000,
    height: 750,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/IMG_1425.jpg',
  },
  {
    src: '/images/IMG_1775.jpg',
    width: 750,
    height: 1000,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/IMG_1775.jpg',
  },
  {
    src: '/images/IMG_1833.jpg',
    width: 700,
    height: 500,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/IMG_1833.jpg',
  },
  {
    src: '/images/IMG_3697.jpg',
    width: 1000,
    height: 750,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/IMG_3697.jpg',
  },
  {
    src: '/images/IMG_3717.jpg',
    width: 900,
    height: 1200,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/IMG_3717.jpg',
  },
  {
    src: '/images/IMG_3900.jpg',
    width: 600,
    height: 1200,
    alt: 'A modern, stylish haircut with clean lines and expertly crafted layers, showcasing a fresh and contemporary look.',
    blurDataURL: '/images/IMG_3900.jpg',
  },
];

function renderNextImage(
  { title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext
) {
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo.src}
        alt={photo.alt || 'kundalini section'}
        title={title}
        sizes={sizes}
        placeholder={
          (photo as CustomPhoto).blurDataURL
            ? 'blur'
            : undefined
        }
        priority={width >= 1200}
        blurDataURL={(photo as CustomPhoto).blurDataURL}
        className="object-cover"
      />
    </div>
  );
}

export default function Gallery({
  id = 'gallery',
}: GallerySectionProps) {
  const t = useTranslations('Gallery');
  return (
    <section
      className="container mx-auto px-6 py-16 md:py-24 lg:py-32"
      id={id}
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-playfair md:text-4xl font-bold text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          {t('subtitle')}
        </p>
        <hr className="border-t border-muted w-full md:w-3/4 my-4 mx-auto" />
      </div>

      <PhotoAlbum
        photos={photos}
        layout="masonry"
        columns={containerWidth => {
          if (containerWidth < 400) return 2;
          if (containerWidth < 800) return 3;
          return 4;
        }}
        spacing={containerWidth =>
          containerWidth < 600 ? 10 : 20
        }
        render={{ image: renderNextImage }}
        defaultContainerWidth={1200}
        sizes={{
          size: '1168px',
          sizes: [
            {
              viewport: '(max-width: 1200px)',
              size: 'calc(100vw - 32px)',
            },
          ],
        }}
      />
    </section>
  );
}

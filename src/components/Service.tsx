'use client';

import React, { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  FaSpa,
  FaCut,
  FaPumpSoap,
  FaBrush,
  FaPalette,
} from 'react-icons/fa';
import AnimatedCard from './AnimatedCard';
import { SparklesHero } from './SparklesHero';

// Tipos para os serviços
type ServiceItem = {
  name: string;
  price: string;
};

type ServiceCategory = {
  key: string;
  name: string;
  items: ServiceItem[];
};

const ServiceSection: React.FC = () => {
  const t = useTranslations('Services');

  const serviceIcons: Record<string, ReactNode> = {
    hair_color_services: (
      <FaPalette className="text-white text-3xl" />
    ),
    haircuts: <FaCut className="text-white text-3xl" />,
    add_on_treatment: (
      <FaPumpSoap className="text-white text-3xl" />
    ),
    design_styling: (
      <FaCut className="text-white text-3xl" />
    ),
    conditioning_treatment: (
      <FaSpa className="text-white text-3xl" />
    ),
    keratin_treatment: (
      <FaBrush className="text-white text-3xl" />
    ),
  };

  const categoriesData = t.raw('categories') as Record<
    string,
    {
      name: string;
      items: Record<
        string,
        { name: string; price: string }
      >;
    }
  >;

  const services: ServiceCategory[] = Object.entries(
    categoriesData
  ).map(([key, value]) => ({
    key,
    name: value.name,
    items: Object.values(value.items),
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto mt-32">
      <h2 className="text-5xl font-bold text-center text-white mb-2">
        {t('title')}
      </h2>
      <p className="text-lg text-center text-gray-300 mb-10 max-w-2xl mx-auto">
        {t('subtitle')}
      </p>
      <div className="flex flex-col gap-6">
        {services.map((category, index) => (
          <div key={index}>
            <h3 className="text-4xl font-semibold text-gold mb-4 flex items-center justify-center gap-2 mt-4 p-6">
              {serviceIcons[category.key] || (
                <FaSpa className="text-white text-3xl" />
              )}
              {category.name}
            </h3>
            <div className="ml-48 w-1/2 items-center justify-center -mt-4">
              <SparklesHero />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {category.items.map((item, i) => (
                <AnimatedCard
                  key={i}
                  title={item.name}
                  price={item.price}
                  icon={
                    serviceIcons[category.key] || (
                      <FaSpa className="text-white text-xl" />
                    )
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;

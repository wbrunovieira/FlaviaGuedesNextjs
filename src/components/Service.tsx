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
import { SparklesHero } from './SparklesHero';

type ServiceItem = {
  name: string;
  price: string;
};

type ServiceGroup = {
  key: string;
  name: string;
  items: ServiceItem[];
};

type ServiceCategory = {
  key: string;
  name: string;
  groups: ServiceGroup[];
};

type ServiceSectionProps = {
  id?: string;
};

const GroupedCard: React.FC<{
  group: ServiceGroup;
  icon: ReactNode;
}> = ({ group, icon }) => {
  const t = useTranslations('Services');
  return (
    <div className="p-4 bg-graphite rounded-lg shadow-md w-full md:w-auto">
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-white font-bold ml-2">
          {group.name}
        </span>
      </div>
      <ul className="text-gray-300 mt-8">
        {group.items.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between border-b border-gray-700 py-1"
          >
            <span className="mr-4">{item.name}</span>
            <span>{item.price} +</span>
          </li>
        ))}
        <p className="mt-8 text-xs">{t('final_price')}</p>
      </ul>
    </div>
  );
};

const ServiceSection: React.FC<ServiceSectionProps> = ({
  id = 'services',
}) => {
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

  // Estrutura refatorada: cada categoria possui grupos de serviços
  const categoriesData = t.raw('categories') as Record<
    string,
    {
      name: string;
      groups: Record<
        string,
        {
          name: string;
          items: Record<
            string,
            { name: string; price: string }
          >;
        }
      >;
    }
  >;

  const services: ServiceCategory[] = Object.entries(
    categoriesData
  ).map(([catKey, catValue]) => ({
    key: catKey,
    name: catValue.name,
    groups: Object.entries(catValue.groups).map(
      ([groupKey, groupValue]) => ({
        key: groupKey,
        name: groupValue.name,
        items: Object.values(groupValue.items),
      })
    ),
  }));

  return (
    <section
      className="p-6 max-w-4xl mx-auto mt-32 border border-gold rounded-lg"
      id={id}
    >
      <h2 className="text-5xl font-bold text-center text-white mb-2">
        {t('title')}
      </h2>
      <p className="text-lg text-center text-gray-300 mb-10 max-w-2xl mx-auto">
        {t('subtitle')}
      </p>
      <div className="flex flex-col gap-6">
        {services.map((category, index) => (
          <div key={index}>
            {/* Cabeçalho centralizado (vertical e horizontalmente) */}
            <div className="flex flex-col items-center justify-center gap-2 mt-4 p-6">
              {serviceIcons[category.key] || (
                <FaSpa className="text-white text-3xl" />
              )}
              <span className="text-4xl font-semibold text-gold">
                {category.name}
              </span>
            </div>
            <div className="ml-48 w-1/2 items-center justify-center -mt-4">
              <SparklesHero />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
              {category.groups.map(group => (
                <GroupedCard
                  key={group.key}
                  group={group}
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
    </section>
  );
};

export default ServiceSection;

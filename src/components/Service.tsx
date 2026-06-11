'use client';

import React from 'react';
import type { IconType } from 'react-icons';
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
  icon: IconType;
}> = ({ group, icon: Icon }) => {
  const t = useTranslations('Services');
  return (
    <div className="group/card relative w-full md:w-[340px] self-stretch rounded-xl border border-gold/15 bg-gradient-to-b from-graphite to-black/60 p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(200,160,75,0.3)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors duration-500 group-hover/card:bg-gold/20">
          <Icon className="text-base" />
        </div>
        <h3 className="font-display text-xl text-white leading-snug">
          {group.name}
        </h3>
      </div>

      <div className="mt-4 h-px w-full bg-gradient-to-r from-gold/40 to-transparent" />

      <ul className="mt-4">
        {group.items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-baseline gap-2 py-2"
          >
            <span className="text-sm text-gray-300">
              {item.name}
            </span>
            <span className="flex-1 -translate-y-[3px] border-b border-dotted border-gray-600/60" />
            <span className="whitespace-nowrap text-sm font-medium tabular-nums text-gold">
              {item.price}{' '}
              <span className="text-xs text-gray-500">
                +
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs italic text-gray-500">
        {t('final_price')}
      </p>
    </div>
  );
};

const ServiceSection: React.FC<ServiceSectionProps> = ({
  id = 'services',
}) => {
  const t = useTranslations('Services');

  const serviceIcons: Record<string, IconType> = {
    hair_color_services: FaPalette,
    haircuts: FaCut,
    add_on_treatment: FaPumpSoap,
    design_styling: FaCut,
    conditioning_treatment: FaSpa,
    keratin_treatment: FaBrush,
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
        {services.map((category, index) => {
          const CategoryIcon =
            serviceIcons[category.key] || FaSpa;
          return (
            <div key={index}>
              <div className="flex flex-col items-center justify-center gap-2 mt-4 p-6">
                <CategoryIcon className="text-gold text-3xl" />
                <span className="font-display text-4xl font-semibold text-gold text-center">
                  {category.name}
                </span>
              </div>
              <div className="ml-48 w-1/2 items-center justify-center -mt-4">
                <SparklesHero />
              </div>
              <div className="flex flex-wrap justify-center items-stretch gap-5 mt-8">
                {category.groups.map(group => (
                  <GroupedCard
                    key={group.key}
                    group={group}
                    icon={CategoryIcon}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs italic text-gray-500">
        {t('surcharge_note')}
      </p>
    </section>
  );
};

export default ServiceSection;

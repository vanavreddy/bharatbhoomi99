/**
 * Bangalore Builders Data
 */

import type { Builder } from '@/types/builder.types';

export const BANGALORE_BUILDERS: Builder[] = [
  {
    id: 'prestige',
    name: 'Prestige Group',
    slug: 'prestige',
    initials: 'PG',
    color: 'bg-blue-600',
    logo: '/images/builders/prestige.png',
    shortDescription: 'Premium projects at affordable prices',
    description:
      "Prestige Group, established in 1986, is one of South India's leading real estate developers with 300+ completed projects across residential, commercial, retail, and hospitality segments.",
    projectCount: 300,
    established: 1986,
    headquarters: 'Bangalore',
    isActive: true,
  },
  {
    id: 'brigade',
    name: 'Brigade Group',
    slug: 'brigade',
    initials: 'BG',
    color: 'bg-red-600',
    logo: '/images/builders/brigade.svg',
    shortDescription: 'Quality homes with world-class amenities',
    description:
      'Brigade Group is a leading property developer in South India, established in 1986. With a strong presence in residential, commercial, and hospitality sectors, Brigade is known for quality construction and timely delivery.',
    projectCount: 250,
    established: 1986,
    headquarters: 'Bangalore',
    isActive: true,
  },
  {
    id: 'sobha',
    name: 'Sobha Limited',
    slug: 'sobha',
    initials: 'SL',
    color: 'bg-green-600',
    logo: '/images/builders/sobha.jpg',
    shortDescription: 'Luxury living redefined',
    description:
      'Sobha Limited is a premium real estate developer known for its backward integration model. Established in 1995, Sobha is renowned for its superior quality construction and attention to detail.',
    projectCount: 150,
    established: 1995,
    headquarters: 'Bangalore',
    isActive: true,
  },
  {
    id: 'godrej',
    name: 'Godrej Properties',
    slug: 'godrej',
    initials: 'GP',
    color: 'bg-purple-600',
    logo: '/images/builders/godrej.webp',
    shortDescription: 'Building a greener tomorrow',
    description:
      "Godrej Properties is one of India's leading real estate companies. As part of the 127-year-old Godrej Group, they bring quality, trust, and innovation to every project they build.",
    projectCount: 200,
    established: 1990,
    headquarters: 'Mumbai',
    isActive: true,
  },
  {
    id: 'birla',
    name: 'Birla Estates',
    slug: 'birla',
    initials: 'BE',
    color: 'bg-amber-600',
    logo: '/images/builders/birla.png',
    shortDescription: 'Crafting exceptional living spaces',
    description:
      "Birla Estates, a part of the Aditya Birla Group, is committed to developing landmark projects. With a focus on design excellence and customer satisfaction, they're redefining modern living.",
    projectCount: 50,
    established: 2016,
    headquarters: 'Mumbai',
    isActive: true,
  },
  {
    id: 'assetz',
    name: 'Assetz Property Group',
    slug: 'assetz',
    initials: 'AP',
    color: 'bg-teal-600',
    logo: '/images/builders/assetz.png',
    shortDescription: 'Innovation in every dimension',
    description:
      'Assetz Property Group is a Bangalore-based real estate developer known for innovative designs and sustainable practices. They specialize in residential and commercial developments.',
    projectCount: 30,
    established: 2006,
    headquarters: 'Bangalore',
    isActive: true,
  },
  {
    id: 'salarpuria',
    name: 'Salarpuria Sattva',
    slug: 'salarpuria',
    initials: 'SS',
    color: 'bg-indigo-600',
    logo: '/images/builders/salarpuria.png',
    shortDescription: 'Creating landmarks since 1986',
    description:
      'Salarpuria Sattva is a leading real estate developer with projects across residential, commercial, and retail segments. Known for quality construction and strategic locations.',
    projectCount: 100,
    established: 1986,
    headquarters: 'Bangalore',
    isActive: true,
  },
  {
    id: 'puravankara',
    name: 'Puravankara',
    slug: 'puravankara',
    initials: 'PV',
    color: 'bg-rose-600',
    logo: '/images/builders/puravankara.png',
    shortDescription: 'Building trust since 1975',
    description:
      "Puravankara Limited is one of India's leading real estate companies with a legacy spanning over four decades. They've delivered millions of sq ft across residential and commercial projects.",
    projectCount: 80,
    established: 1975,
    headquarters: 'Bangalore',
    isActive: true,
  },
];

export const getBuilderBySlug = (slug: string): Builder | undefined => {
  return BANGALORE_BUILDERS.find((builder) => builder.slug === slug);
};

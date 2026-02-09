import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/lib/constants/seo';
import ListPropertyClient from './ListPropertyClient';

export const metadata: Metadata = {
  title: PAGE_TITLES.listProperty,
  description: PAGE_DESCRIPTIONS.listProperty,
  alternates: {
    canonical: `${SITE_CONFIG.url}/list-property`,
  },
  openGraph: {
    title: `${PAGE_TITLES.listProperty} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.listProperty,
    url: `${SITE_CONFIG.url}/list-property`,
    images: [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
  },
};

export default function ListPropertyPage() {
  return <ListPropertyClient />;
}

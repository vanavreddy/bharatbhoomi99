import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/lib/constants/seo';
import { JsonLd } from '@/components/seo';
import { getBreadcrumbSchema } from '@/lib/seo';
import BuildersClient from './BuildersClient';

export const metadata: Metadata = {
  title: PAGE_TITLES.builders,
  description: PAGE_DESCRIPTIONS.builders,
  alternates: {
    canonical: `${SITE_CONFIG.url}/builders`,
  },
  openGraph: {
    title: `${PAGE_TITLES.builders} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.builders,
    url: `${SITE_CONFIG.url}/builders`,
    images: [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
  },
};

export default function BuildersPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Builders', url: `${SITE_CONFIG.url}/builders` },
        ])}
      />
      <BuildersClient />
    </>
  );
}

import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/lib/constants/seo';
import { JsonLd } from '@/components/seo';
import { getBreadcrumbSchema } from '@/lib/seo';
import PropertiesClient from './PropertiesClient';

export const metadata: Metadata = {
  title: PAGE_TITLES.properties,
  description: PAGE_DESCRIPTIONS.properties,
  alternates: {
    canonical: `${SITE_CONFIG.url}/properties`,
  },
  openGraph: {
    title: `${PAGE_TITLES.properties} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.properties,
    url: `${SITE_CONFIG.url}/properties`,
    images: [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
  },
};

export default function PropertiesPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Properties', url: `${SITE_CONFIG.url}/properties` },
        ])}
      />
      <PropertiesClient />
    </>
  );
}

import type { Metadata } from 'next';
import { SITE_CONFIG, PAGE_TITLES } from '@/lib/constants/seo';
import { BANGALORE_BUILDERS, getBuilderBySlug } from '@/lib/constants/builders';
import { JsonLd } from '@/components/seo';
import { getBreadcrumbSchema } from '@/lib/seo';
import BuilderDetailClient from './BuilderDetailClient';

interface BuilderDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return BANGALORE_BUILDERS
    .filter((b) => b.isActive)
    .map((builder) => ({
      slug: builder.slug,
    }));
}

export async function generateMetadata({ params }: BuilderDetailPageProps): Promise<Metadata> {
  const builder = getBuilderBySlug(params.slug);

  if (!builder) {
    return {
      title: 'Builder Not Found',
    };
  }

  const title = PAGE_TITLES.builderDetail(builder.name);
  const description = `${builder.description} Explore ${builder.projectCount}+ projects by ${builder.name} in Bangalore.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/builders/${builder.slug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: `${SITE_CONFIG.url}/builders/${builder.slug}`,
      images: [
        {
          url: builder.logo,
          alt: `${builder.name} logo`,
        },
      ],
    },
  };
}

export default function BuilderDetailPage({ params }: BuilderDetailPageProps) {
  const builder = getBuilderBySlug(params.slug);
  const breadcrumbItems = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Builders', url: `${SITE_CONFIG.url}/builders` },
    ...(builder ? [{ name: builder.name, url: `${SITE_CONFIG.url}/builders/${builder.slug}` }] : []),
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      <BuilderDetailClient />
    </>
  );
}

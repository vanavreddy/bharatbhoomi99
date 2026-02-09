import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants/seo';
import { propertyService } from '@/lib/api';
import { JsonLd } from '@/components/seo';
import { getBreadcrumbSchema, getPropertyListingSchema } from '@/lib/seo';
import PropertyDetailClient from './PropertyDetailClient';

interface PropertyPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const property = await propertyService.getPropertyById(id);
    const title = `${property.title} - ${property.bedrooms} BHK ${property.type} for ${property.listingType === 'rent' ? 'Rent' : 'Sale'} in ${property.address.locality}, ${property.address.city}`;
    const description = property.description
      ? property.description.slice(0, 160)
      : `${property.bedrooms} BHK ${property.type} available for ${property.listingType} in ${property.address.locality}, ${property.address.city}. ${property.area} sq.ft, ${property.furnishing} furnished.`;
    const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_CONFIG.url}/properties/${id}`,
      },
      openGraph: {
        title: `${title} | ${SITE_CONFIG.name}`,
        description,
        url: `${SITE_CONFIG.url}/properties/${id}`,
        images: primaryImage
          ? [{ url: primaryImage.url, alt: primaryImage.alt || property.title }]
          : [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
      },
    };
  } catch {
    return {
      title: 'Property Details',
      description: 'View property details, photos, amenities, and pricing on Bharat Bhoomi-99. Contact the owner directly.',
      alternates: {
        canonical: `${SITE_CONFIG.url}/properties/${id}`,
      },
    };
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const breadcrumbItems = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Properties', url: `${SITE_CONFIG.url}/properties` },
  ];

  let propertySchema = null;
  try {
    const property = await propertyService.getPropertyById(params.id);
    breadcrumbItems.push({
      name: property.title,
      url: `${SITE_CONFIG.url}/properties/${params.id}`,
    });
    propertySchema = getPropertyListingSchema(property);
  } catch {
    // Property fetch failed — render client without structured data
  }

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      {propertySchema && <JsonLd data={propertySchema} />}
      <PropertyDetailClient params={params} />
    </>
  );
}

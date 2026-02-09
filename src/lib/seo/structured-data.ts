import { SITE_CONFIG } from '@/lib/constants/seo';
import type { Property } from '@/types/property.types';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bharat Bhoomi-99',
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/userinfo/primaryLogo.jpeg`,
    email: 'contact@bharatbhoomi99.com',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-9448514449',
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Kannada'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-9900151820',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Kannada'],
      },
    ],
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Bharat Bhoomi-99',
    image: `${SITE_CONFIG.url}/images/userinfo/primaryLogo.jpeg`,
    url: SITE_CONFIG.url,
    telephone: '+91-9448514449',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.99/1, Chandapura Dommasandra Road, Sri Bayalu Basaveshwara Swamy Temple',
      addressLocality: 'Kommasandra',
      addressRegion: 'Karnataka',
      postalCode: '562125',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.8003,
      longitude: 77.6834,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: [
      { '@type': 'City', name: 'Bangalore' },
      { '@type': 'Place', name: 'Chandapura' },
      { '@type': 'Place', name: 'Dommasandra' },
      { '@type': 'Place', name: 'Electronic City' },
      { '@type': 'Place', name: 'Kommasandra' },
    ],
    priceRange: '$$',
    description: SITE_CONFIG.description,
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/properties?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFaqSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Madhu Chandra',
    jobTitle: 'Founder & Family Realtor',
    worksFor: {
      '@type': 'Organization',
      name: 'Bharat Bhoomi-99',
    },
    telephone: ['+91-9448514449', '+91-9900151820'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.99/1, Chandapura Dommasandra Road',
      addressLocality: 'Kommasandra, Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '562125',
      addressCountry: 'IN',
    },
    image: `${SITE_CONFIG.url}/images/userinfo/logo.jpeg`,
    url: `${SITE_CONFIG.url}/about`,
  };
}

export function getPropertyListingSchema(property: Property) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${SITE_CONFIG.url}/properties/${property.id}`,
    datePosted: property.createdAt,
    ...(primaryImage && { image: primaryImage.url }),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address.street || property.address.locality,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.pincode,
      addressCountry: 'IN',
    },
    ...(property.address.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.address.coordinates.latitude,
        longitude: property.address.coordinates.longitude,
      },
    }),
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'FTK',
    },
  };
}

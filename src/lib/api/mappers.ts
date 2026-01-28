/**
 * Data Mappers - Transform external API data to internal domain types
 * Following Single Responsibility Principle (SRP)
 * Strict TypeScript - all types match the actual API response
 */

import type { Property, PropertyImage, PropertyOwner, Address, PropertyAmenity } from '@/types/property.types';
import type { ExternalPropertyListItem, ExternalPropertyDetail, ExternalPropertyOwner } from './types';

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title: string, id: number): string {
  const cleanTitle = title.trim().toLowerCase();
  return `${cleanTitle
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-${id}`;
}

/**
 * Parse string to number safely (for bedRooms, baths which are strings in API)
 */
function parseStringToNumber(value: string | undefined | null, fallback = 0): number {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Ensure a number value, with fallback
 */
function ensureNumber(value: number | undefined | null, fallback = 0): number {
  if (value === undefined || value === null) return fallback;
  return typeof value === 'number' && !isNaN(value) ? value : fallback;
}

/**
 * Trim and clean string value
 */
function cleanString(value: string | null | undefined, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  return value.trim();
}

/**
 * Map furnishing status from boolean
 */
function mapFurnishingStatus(isFurnished: boolean): Property['furnishing'] {
  return isFurnished ? 'furnished' : 'unfurnished';
}

/**
 * Map property type from API category/type strings
 */
function mapPropertyType(type: string | null, category: string | null): Property['type'] {
  const typeStr = (type || category || '').toLowerCase().trim();

  if (typeStr.includes('apartment') || typeStr.includes('flat')) return 'apartment';
  if (typeStr.includes('house') || typeStr.includes('home') || typeStr.includes('independent')) return 'house';
  if (typeStr.includes('villa')) return 'villa';
  if (typeStr.includes('plot') || typeStr.includes('land')) return 'plot';
  if (typeStr.includes('commercial') || typeStr.includes('office') || typeStr.includes('shop')) return 'commercial';
  if (typeStr.includes('pg') || typeStr.includes('hostel')) return 'pg';

  return 'apartment';
}

/**
 * Map images from API imageLinks array
 */
function mapImages(imageLinks: string[]): readonly PropertyImage[] {
  if (!imageLinks || imageLinks.length === 0) {
    return [];
  }

  return imageLinks.map((url, index) => ({
    id: `img-${index}`,
    url: url.trim(),
    alt: `Property image ${index + 1}`,
    width: 800,
    height: 600,
    isPrimary: index === 0,
  }));
}

/**
 * Map owner from API response
 */
function mapOwner(owner: ExternalPropertyOwner | null, fallbackUserId: number): PropertyOwner {
  // Build owner name from firstName/lastName or fallback to userName
  let ownerName = 'Property Owner';
  if (owner) {
    const nameParts = [owner.firstName, owner.middleName, owner.lastName].filter(Boolean);
    if (nameParts.length > 0) {
      ownerName = nameParts.join(' ');
    } else if (owner.userName) {
      ownerName = owner.userName;
    }
  }

  return {
    id: String(owner?.userId || fallbackUserId || 0),
    name: ownerName,
    phone: cleanString(owner?.userPhone),
    email: owner?.userEmail,
    isVerified: owner?.isVerified ?? false,
    avatar: undefined,
  };
}

/**
 * Map address from API list item - all fields are required on API
 */
function mapAddressFromListItem(item: ExternalPropertyListItem): Address {
  return {
    street: cleanString(item.addressLine1),
    locality: cleanString(item.zone),
    city: cleanString(item.city),
    state: cleanString(item.state),
    pincode: cleanString(item.zipCode),
    landmark: item.addressLine2 ? cleanString(item.addressLine2) : undefined,
    // Note: API doesn't provide lat/lng in list response
    coordinates: undefined,
  };
}

/**
 * Map amenities from API fields
 */
function mapAmenities(
  parking: string | null,
  water: string | null,
  electricity: string | null,
  isFurnished: boolean
): readonly PropertyAmenity[] {
  const amenities: PropertyAmenity[] = [];

  // Parking amenity
  if (parking && parking.toLowerCase() !== 'none') {
    amenities.push({
      id: 'parking',
      name: parking.toLowerCase().includes('covered') ? 'Covered Parking' :
            parking.toLowerCase().includes('open') ? 'Open Parking' : parking,
      icon: 'car',
      category: 'basic',
    });
  }

  // Water amenity
  if (water && water.toLowerCase() !== 'none') {
    amenities.push({
      id: 'water',
      name: water.toLowerCase().includes('borewell') ? 'Borewell' :
            water.toLowerCase().includes('municipal') ? 'Municipal Water' : water,
      icon: 'droplet',
      category: 'basic',
    });
  }

  // Electricity amenity
  if (electricity && electricity.toLowerCase() !== 'none') {
    amenities.push({
      id: 'electricity',
      name: electricity,
      icon: 'zap',
      category: 'basic',
    });
  }

  // Furnished amenity
  if (isFurnished) {
    amenities.push({
      id: 'furnished',
      name: 'Furnished',
      icon: 'sofa',
      category: 'comfort',
    });
  }

  return amenities;
}

/**
 * Map external property list item to internal Property type
 * Strictly typed to match ExternalPropertyListItem interface
 */
export function mapPropertyFromListItem(item: ExternalPropertyListItem): Property {
  // Numbers come directly from API (no parsing needed)
  const rent = ensureNumber(item.rent);
  const deposit = ensureNumber(item.deposit);
  const area = ensureNumber(item.area);

  // Strings need parsing to numbers
  const bedrooms = parseStringToNumber(item.bedRooms, 1);
  const bathrooms = parseStringToNumber(item.baths, 1);

  // Clean the property name (API sometimes has trailing spaces)
  const title = cleanString(item.propertyName, 'Untitled Property');

  return {
    id: String(item.propertyID),
    title,
    slug: generateSlug(title, item.propertyID),
    description: cleanString(item.comments),
    type: mapPropertyType(item.type, item.category),
    status: 'available',
    listingType: 'rent',
    price: rent,
    priceUnit: 'month',
    securityDeposit: deposit > 0 ? deposit : undefined,
    area,
    bedrooms,
    bathrooms,
    furnishing: mapFurnishingStatus(item.isFurnished),
    availableFrom: item.addCreatedOn || new Date().toISOString(),
    address: mapAddressFromListItem(item),
    amenities: mapAmenities(item.parking, item.water, item.electricity, item.isFurnished),
    images: mapImages(item.imageLinks),
    owner: mapOwner(item.owner, item.userId),
    isFeatured: false,
    views: 0,
    createdAt: item.addCreatedOn || new Date().toISOString(),
    updatedAt: item.modifiedOn || item.addCreatedOn || new Date().toISOString(),
  };
}

/**
 * Map external property detail to internal Property type
 * Strictly typed to match ExternalPropertyDetail interface
 */
export function mapPropertyFromDetail(response: ExternalPropertyDetail): Property {
  const { propertyInformation: info, address, imageLinks, owner } = response;

  // Clean the property name (API sometimes has trailing spaces)
  const title = cleanString(info.propertyName, 'Untitled Property');

  // Numbers from detail API
  const rent = ensureNumber(info.rent);
  const deposit = ensureNumber(info.deposit);
  const area = ensureNumber(info.area);

  // Strings need parsing to numbers
  const bedrooms = parseStringToNumber(info.bedRooms, 1);
  const bathrooms = parseStringToNumber(info.baths, 1);

  // Build amenities from detail fields
  const amenities = mapAmenities(
    info.parking ?? null,
    info.water ?? null,
    info.electricity ?? null,
    info.isFurnished ?? false
  );

  return {
    id: String(info.propertyID),
    title,
    slug: generateSlug(title, info.propertyID),
    description: cleanString(info.comments),
    type: mapPropertyType(info.type ?? null, info.category ?? null),
    status: 'available',
    listingType: 'rent',
    price: rent,
    priceUnit: 'month',
    securityDeposit: deposit > 0 ? deposit : undefined,
    area,
    bedrooms,
    bathrooms,
    furnishing: mapFurnishingStatus(info.isFurnished ?? false),
    availableFrom: info.createdOn || new Date().toISOString(),
    address: {
      street: cleanString(address.addressLine1),
      locality: cleanString(address.zone),
      city: cleanString(address.city),
      state: cleanString(address.state),
      pincode: cleanString(address.zipCode),
      landmark: address.addressLine2 ? cleanString(address.addressLine2) : undefined,
      coordinates: undefined,
    },
    amenities,
    images: mapImages(imageLinks),
    owner: mapOwner(owner ?? null, info.oUserID ?? 0),
    isFeatured: false,
    views: 0,
    createdAt: info.createdOn || new Date().toISOString(),
    updatedAt: info.modifiedOn || info.createdOn || new Date().toISOString(),
  };
}

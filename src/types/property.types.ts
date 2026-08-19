/**
 * Property domain types with strict typing
 */

export type PropertyType = 'apartment' | 'house' | 'villa' | 'plot' | 'commercial' | 'pg';

export type PropertyStatus = 'available' | 'sold' | 'pending';

export type FurnishingStatus = 'furnished' | 'semi-furnished' | 'unfurnished';

export type ListingType = 'sale';

export interface GeoLocation {
  readonly latitude: number;
  readonly longitude: number;
}

export interface Address {
  readonly street: string;
  readonly locality: string;
  readonly city: string;
  readonly state: string;
  readonly pincode: string;
  readonly landmark?: string;
  readonly coordinates?: GeoLocation;
}

export interface PropertyAmenity {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly category: 'basic' | 'comfort' | 'safety' | 'lifestyle';
}

export interface PropertyImage {
  readonly id: string;
  readonly url: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly blurhash?: string;
}

export interface PropertyOwner {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly isVerified: boolean;
  readonly avatar?: string;
}

export interface Property {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string;
  readonly type: PropertyType;
  readonly status: PropertyStatus;
  readonly listingType: ListingType;
  readonly price: number;
  readonly area: number;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly balconies?: number;
  readonly floor?: number;
  readonly totalFloors?: number;
  readonly facing?: string;
  readonly furnishing: FurnishingStatus;
  readonly ageOfProperty?: number;
  readonly availableFrom: string;
  readonly address: Address;
  readonly amenities: readonly PropertyAmenity[];
  readonly images: readonly PropertyImage[];
  readonly owner: PropertyOwner;
  readonly isFeatured: boolean;
  readonly views: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  balconies?: number;
  floor?: number;
  totalFloors?: number;
  facing?: string;
  furnishing: FurnishingStatus;
  ageOfProperty?: number;
  availableFrom: string;
  address: Omit<Address, 'coordinates'>;
  amenityIds: string[];
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

export interface PropertyFilters {
  type?: PropertyType[];
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  city?: string;
  locality?: string;
  furnishing?: FurnishingStatus[];
  sortBy?: 'price_asc' | 'price_desc' | 'date_newest' | 'date_oldest';
  query?: string;
  /** Only listings an admin has marked as featured. */
  featured?: boolean;
}

export interface PropertyListResponse {
  readonly data: readonly Property[];
  readonly pagination: PaginationMeta;
  readonly filters: PropertyFilters;
}

/**
 * Property-related constants
 */

import type { PropertyType, FurnishingStatus, ListingType } from '@/types';

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
];

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: 'sale', label: 'For Sale' },
];

export const FURNISHING_OPTIONS: { value: FurnishingStatus; label: string }[] = [
  { value: 'furnished', label: 'Fully Furnished' },
  { value: 'semi-furnished', label: 'Semi Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 BHK' },
  { value: 2, label: '2 BHK' },
  { value: 3, label: '3 BHK' },
  { value: 4, label: '4 BHK' },
  { value: 5, label: '5+ BHK' },
];

export const PRICE_RANGES = [
  { min: 0, max: 2500000, label: 'Under 25L' },
  { min: 2500000, max: 5000000, label: '25L - 50L' },
  { min: 5000000, max: 10000000, label: '50L - 1Cr' },
  { min: 10000000, max: 50000000, label: '1Cr - 5Cr' },
  { min: 50000000, max: null, label: 'Above 5Cr' },
];

export const SORT_OPTIONS = [
  { value: 'date_newest', label: 'Newest First' },
  { value: 'date_oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export const AMENITIES = [
  // Basic
  { id: 'parking', name: 'Parking', icon: 'car', category: 'basic' as const },
  { id: 'lift', name: 'Lift', icon: 'arrow-up', category: 'basic' as const },
  { id: 'power-backup', name: 'Power Backup', icon: 'zap', category: 'basic' as const },
  { id: 'water-supply', name: '24/7 Water', icon: 'droplet', category: 'basic' as const },
  // Comfort
  { id: 'ac', name: 'Air Conditioning', icon: 'wind', category: 'comfort' as const },
  { id: 'wifi', name: 'WiFi', icon: 'wifi', category: 'comfort' as const },
  { id: 'washing-machine', name: 'Washing Machine', icon: 'waves', category: 'comfort' as const },
  { id: 'refrigerator', name: 'Refrigerator', icon: 'refrigerator', category: 'comfort' as const },
  // Safety
  { id: 'security', name: '24/7 Security', icon: 'shield', category: 'safety' as const },
  { id: 'cctv', name: 'CCTV', icon: 'video', category: 'safety' as const },
  { id: 'fire-safety', name: 'Fire Safety', icon: 'flame', category: 'safety' as const },
  { id: 'gated', name: 'Gated Community', icon: 'lock', category: 'safety' as const },
  // Lifestyle
  { id: 'gym', name: 'Gym', icon: 'dumbbell', category: 'lifestyle' as const },
  { id: 'swimming-pool', name: 'Swimming Pool', icon: 'waves', category: 'lifestyle' as const },
  { id: 'garden', name: 'Garden', icon: 'trees', category: 'lifestyle' as const },
  { id: 'clubhouse', name: 'Clubhouse', icon: 'home', category: 'lifestyle' as const },
];

export const INDIAN_STATES = [
  'Karnataka',
];

export const BANGALORE_AREAS = [
  'Whitefield',
  'Electronic City',
  'Sarjapur Road',
  'Hebbal',
  'Yelahanka',
  'Bannerghatta Road',
  'Devanahalli',
  'Thanisandra',
  'Chandapura',
  'Hosur Road',
  'KR Puram',
  'Marathahalli',
  'HSR Layout',
  'Koramangala',
  'JP Nagar',
  'Banashankari',
  'Rajajinagar',
  'Jayanagar',
  'Indiranagar',
  'Kanakapura Road',
];

/** @deprecated Use BANGALORE_AREAS instead */
export const MAJOR_CITIES = BANGALORE_AREAS;

// Parking options matching the API
export const PARKING_OPTIONS = [
  { value: 'None', label: 'No Parking' },
  { value: 'On-Site', label: 'On-Site Parking' },
  { value: 'Road-Side', label: 'Road-Side Parking' },
  { value: 'Garage', label: 'Garage' },
  { value: 'Shared', label: 'Shared Parking' },
  { value: 'Covered', label: 'Covered Parking' },
];

// Water supply options matching the API
export const WATER_OPTIONS = [
  { value: 'Municipal', label: 'Municipal/City Water' },
  { value: 'Borewell', label: 'Borewell' },
  { value: 'Open Well', label: 'Open Well' },
  { value: 'Rain-Water Harvesting', label: 'Rain-Water Harvesting' },
  { value: 'Tanker', label: 'Tanker Supply' },
];

// Electricity options matching the API
export const ELECTRICITY_OPTIONS = [
  { value: 'Grid', label: 'Grid/City Power' },
  { value: 'Solar', label: 'Solar Power' },
  { value: 'Generator', label: 'Generator Backup' },
  { value: 'Inverter', label: 'Inverter Backup' },
];

// Facing options for plot/land properties
export const FACING_OPTIONS = [
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'East', label: 'East' },
  { value: 'West', label: 'West' },
  { value: 'NE', label: 'North-East' },
  { value: 'NW', label: 'North-West' },
  { value: 'SE', label: 'South-East' },
  { value: 'SW', label: 'South-West' },
];

// Plot approval type options
export const PLOT_APPROVAL_OPTIONS = [
  { value: 'BDA', label: 'BDA Approved' },
  { value: 'BBMP', label: 'BBMP Approved' },
  { value: 'BMRDA', label: 'BMRDA Approved' },
  { value: 'DTCP', label: 'DTCP Approved' },
  { value: 'Revenue Site', label: 'Revenue Site' },
  { value: 'Gramathana', label: 'Gramathana' },
  { value: 'Other', label: 'Other' },
];

// Property categories for the API (values match the React Native app / Azure backend)
export const PROPERTY_CATEGORIES = [
  { value: 'apartment', label: 'Apartment/Flat' },
  { value: 'independent_house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'builder_floor', label: 'Builder Floor' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio Apartment' },
  { value: 'farm_house', label: 'Farm House' },
  { value: 'plot', label: 'Plot / Land' },
  { value: 'commercial_office', label: 'Commercial Office' },
  { value: 'commercial_shop', label: 'Commercial Shop' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'pg_hostel', label: 'PG / Hostel' },
];

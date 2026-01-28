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
  { value: 'pg', label: 'PG/Hostel' },
];

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: 'rent', label: 'For Rent' },
  { value: 'sale', label: 'For Sale' },
  { value: 'lease', label: 'For Lease' },
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
  { min: 0, max: 10000, label: 'Under 10K' },
  { min: 10000, max: 20000, label: '10K - 20K' },
  { min: 20000, max: 50000, label: '20K - 50K' },
  { min: 50000, max: 100000, label: '50K - 1L' },
  { min: 100000, max: null, label: 'Above 1L' },
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
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

export const MAJOR_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Surat',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ghaziabad',
];

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

// Property categories for the API
export const PROPERTY_CATEGORIES = [
  { value: 'Apartment', label: 'Apartment/Flat' },
  { value: 'Independent House', label: 'Independent House' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Builder Floor', label: 'Builder Floor' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Studio', label: 'Studio Apartment' },
  { value: 'Farm House', label: 'Farm House' },
  { value: 'PG', label: 'PG/Hostel' },
];

/**
 * External API Types - Matching the backend API structure exactly
 * These types represent the raw API response format with strict typing
 */

// Generic API response wrapper from the backend
export interface ExternalApiResponse<T> {
  model: T;
  success: boolean;
  message: string;
  isAuthorized?: boolean;
  apiErrors?: string[];
}

// Property list item from API - matches actual response structure
export interface ExternalPropertyListItem {
  // Core identifiers
  propertyID: number;
  gtagID: number;
  addressID: number;

  // Property details
  propertyName: string;
  type: string | null;
  category: string | null;
  bedRooms: string;
  baths: string;
  rent: number;
  deposit: number;
  area: number;
  isNegotiable: boolean;
  isFurnished: boolean;
  comments: string | null;

  // Amenities
  parking: string | null;
  water: string | null;
  electricity: string | null;

  // Address fields
  city: string;
  state: string;
  country: string;
  zipCode: string;
  zone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  unitNo: string | null;

  // Images
  imageLinks: string[];
  noOfImages: number;

  // User relationships
  userId: number;
  oUserID: number;
  tUserID: number;
  rUserID?: number;
  cUserID?: number | null;
  userPropertyRelation: boolean;

  // Owner info
  owner: ExternalPropertyOwner | null;

  // Timestamps
  createdOn: string | null;
  modifiedOn: string | null;
  modifiedBy: string | null;
  addCreatedOn: string;
  addModifiedOn: string | null;
  addModifiedBy: string | null;

  // Other
  uName: string | null;
  agencyID?: number;
  homeTour?: unknown[];
}

export interface ExternalPropertyOwner {
  userId: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  isVerified?: boolean;
  isAgent?: boolean;
  agencyId?: number;
  agencyName?: string;
}

// Property detail from API
export interface ExternalPropertyDetail {
  propertyInformation: {
    propertyID: number;
    type?: string;
    gtagID?: number;
    addressID?: number;
    userPropertyRelation?: boolean;
    propertyName: string;
    bedRooms: string;
    rent: number;
    deposit?: number;
    isNegotiable?: boolean;
    area: number;
    baths: string;
    isFurnished?: boolean;
    comments?: string;
    oUserID?: number;
    tUserID?: number | null;
    createdOn?: string;
    modifiedOn?: string | null;
    modifiedBy?: string | null;
    parking?: string | null;
    water?: string | null;
    electricity?: string | null;
    category?: string | null;
    noOfImages?: number;
  };
  address: {
    city: string;
    state: string;
    country: string;
    zipCode: string;
    zone?: string;
    addressLine1: string;
    addressLine2?: string | null;
    unitNo?: string;
    createdOn?: string;
    addressID: number;
    userId?: number;
  };
  imageLinks: string[];
  imageURLs?: string[] | null;
  owner?: ExternalPropertyOwner;
  tenant?: ExternalPropertyOwner | null;
}

export interface ExternalPropertyDetailResponse {
  model: ExternalPropertyDetail;
  isAuthorized: boolean;
  apiErrors: string[];
  mobileUser?: ExternalPropertyOwner;
}

// Search request parameters - All filter arrays are required by the API
export interface PropertySearchRequest {
  Category: string[];
  Rent: string[];
  Area: string[];
  BedRooms: string[];
  Baths: string[];
  Parking: string[];
  Water: string[];
  offsetVal: number;
  limit: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  userId?: number;
}

// Filter options from API
export interface FilterOption {
  id: number;
  key: string;
  values: string[];
  isRange: boolean;
  isMultiple: boolean;
  isActive: boolean;
}

export interface FiltersResponse {
  model: FilterOption[];
  success: boolean;
  message: string;
}

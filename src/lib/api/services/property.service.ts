/**
 * Property Service - Business logic layer for property operations
 * Following Interface Segregation Principle (ISP) and Dependency Inversion (DIP)
 */

import { httpClient } from '../http-client';
import { API_CONFIG } from '../config';
import { ApiError } from '../errors';
import { mapPropertyFromListItem } from '../mappers';
import type { Property, PropertyFilters, PropertyListResponse, PaginationMeta } from '@/types/property.types';
import type {
  ExternalApiResponse,
  ExternalPropertyListItem,
  PropertySearchRequest,
  FiltersResponse,
} from '../types';

// Service interface - allows for easy mocking and testing
export interface IPropertyService {
  getProperties(params?: PropertyQueryParams): Promise<PropertyListResponse>;
  getPropertyById(id: string): Promise<Property>;
  searchProperties(params: PropertySearchParams): Promise<PropertyListResponse>;
  createProperty(data: CreatePropertyInput, imageFiles?: File[]): Promise<CreatePropertyResult>;
  getFilterOptions(): Promise<FilterOptions>;
}

// Query parameters for listing properties
export interface PropertyQueryParams {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search parameters with filters
export interface PropertySearchParams extends PropertyQueryParams {
  query?: string;
  filters?: PropertyFilters;
}

// Input for creating a property
export interface CreatePropertyInput {
  userEmail: string;
  propertyName: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  area: number;
  isNegotiable?: boolean;
  isFurnished?: boolean;
  comments?: string;
  parking?: string;
  water?: string;
  electricity?: string;
  category?: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country?: string;
    zipCode: string;
    zone?: string;
  };
}

// Result of creating a property
export interface CreatePropertyResult {
  success: boolean;
  message: string;
  propertyId?: number;
}

// Available filter options
export interface FilterOptions {
  bedrooms: string[];
  price: string[];
  area: string[];
  parking: string[];
  water: string[];
  category: string[];
}

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/**
 * Build a complete search request with all required fields
 * The external API requires all filter arrays to be present (even if empty)
 */
function buildSearchRequest(
  offset: number,
  limit: number,
  sortField: string,
  sortOrder: 'asc' | 'desc',
  query?: string,
  filters?: PropertyFilters
): PropertySearchRequest {
  // Start with all required fields as empty arrays (API requirement)
  const request: PropertySearchRequest = {
    Category: [],
    Rent: [],
    Area: [],
    BedRooms: [],
    Baths: [],
    Parking: [],
    Water: [],
    offsetVal: offset,
    limit,
    sortField,
    sortOrder,
    searchQuery: query || '', // Must be string, not undefined
  };

  // Apply filters if provided
  if (filters) {
    if (filters.type && filters.type.length > 0) {
      request.Category = filters.type;
    }
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      request.BedRooms = filters.bedrooms.map(String);
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const rentRange: string[] = [];
      if (filters.minPrice !== undefined) rentRange.push(String(filters.minPrice));
      if (filters.maxPrice !== undefined) rentRange.push(String(filters.maxPrice));
      request.Rent = rentRange;
    }
  }

  return request;
}

/**
 * Property Service Implementation
 */
class PropertyService implements IPropertyService {
  /**
   * Get paginated list of properties
   */
  async getProperties(params: PropertyQueryParams = {}): Promise<PropertyListResponse> {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sortField = 'addCreatedOn', sortOrder = 'desc' } = params;

    const offset = (page - 1) * limit;

    const searchRequest = buildSearchRequest(offset, limit, sortField, sortOrder);

    const { data } = await httpClient.post<ExternalApiResponse<ExternalPropertyListItem[]>>(
      API_CONFIG.ENDPOINTS.PROPERTY.SEARCH,
      searchRequest
    );

    if (!data.success) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: data.message || 'Failed to fetch properties',
        retryable: true,
      });
    }

    const properties = (data.model || []).map(mapPropertyFromListItem);

    // Note: The API doesn't return total count, so we estimate pagination
    const hasMore = properties.length === limit;
    const pagination: PaginationMeta = {
      page,
      limit,
      total: hasMore ? (page * limit) + 1 : page * limit, // Estimate
      totalPages: hasMore ? page + 1 : page,
      hasNext: hasMore,
      hasPrev: page > 1,
    };

    return {
      data: properties,
      pagination,
      filters: {},
    };
  }

  /**
   * Get a single property by ID
   * Note: Since there's no dedicated endpoint for a single property,
   * we fetch from search API and find by propertyID
   */
  async getPropertyById(id: string): Promise<Property> {
    // Fetch properties using search API with a larger limit to find the property
    const searchRequest = buildSearchRequest(0, 100, 'addCreatedOn', 'desc');

    const { data } = await httpClient.post<ExternalApiResponse<ExternalPropertyListItem[]>>(
      API_CONFIG.ENDPOINTS.PROPERTY.SEARCH,
      searchRequest
    );

    if (!data.success || !data.model) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: 'Failed to fetch property data',
        retryable: true,
      });
    }

    // Find the property by ID
    const propertyId = parseInt(id, 10);
    const property = data.model.find((p) => p.propertyID === propertyId);

    if (!property) {
      throw new ApiError({
        code: 'NOT_FOUND',
        message: 'Property not found',
        status: 404,
        retryable: false,
      });
    }

    return mapPropertyFromListItem(property);
  }

  /**
   * Search properties with filters
   */
  async searchProperties(params: PropertySearchParams): Promise<PropertyListResponse> {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      sortField = 'addCreatedOn',
      sortOrder = 'desc',
      query,
      filters,
    } = params;

    const offset = (page - 1) * limit;

    const searchRequest = buildSearchRequest(offset, limit, sortField, sortOrder, query, filters);

    const { data } = await httpClient.post<ExternalApiResponse<ExternalPropertyListItem[]>>(
      API_CONFIG.ENDPOINTS.PROPERTY.SEARCH,
      searchRequest
    );

    if (!data.success) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: data.message || 'Failed to search properties',
        retryable: true,
      });
    }

    const properties = (data.model || []).map(mapPropertyFromListItem);

    const hasMore = properties.length === limit;
    const pagination: PaginationMeta = {
      page,
      limit,
      total: hasMore ? (page * limit) + 1 : page * limit,
      totalPages: hasMore ? page + 1 : page,
      hasNext: hasMore,
      hasPrev: page > 1,
    };

    return {
      data: properties,
      pagination,
      filters: filters || {},
    };
  }

  /**
   * Create a new property listing
   * Uses multipart/form-data with bracket-notation fields (required by Azure backend)
   */
  async createProperty(input: CreatePropertyInput, imageFiles?: File[]): Promise<CreatePropertyResult> {
    const currentTime = new Date().toISOString();
    const unitNumbers = ['1'];

    const formData = new FormData();

    // Top-level fields
    formData.append('UserEmail', input.userEmail);

    // UnitNo array
    unitNumbers.forEach((unit, index) => {
      formData.append(`UnitNo[${index}]`, unit);
    });

    // PropertyInformation fields (bracket notation matching Postman/Azure)
    const propInfo: Record<string, string> = {
      Type: (input.category || 'apartment').substring(0, 50),
      PropertyName: input.propertyName.substring(0, 100),
      BedRooms: String(input.bedrooms),
      Baths: String(input.bathrooms),
      Rent: String(input.price),
      Deposit: '0',
      IsNegotiable: String(input.isNegotiable || false),
      Area: String(input.area),
      IsFurnished: String(input.isFurnished || false),
      Comments: (input.comments || '').substring(0, 500),
      Parking: (input.parking || 'None').substring(0, 50),
      Water: (input.water || 'Municipal').substring(0, 50),
      Electricity: (input.electricity || 'Available').substring(0, 50),
      Category: (input.category || 'apartment').substring(0, 50),
      CreatedOn: currentTime,
    };

    for (const [key, value] of Object.entries(propInfo)) {
      formData.append(`PropertyInformation[${key}]`, value);
    }

    // Address fields (bracket notation) — truncated to DB column limits
    const address: Record<string, string> = {
      AddressLine1: input.address.addressLine1.substring(0, 50),
      AddressLine2: (input.address.addressLine2 || '').substring(0, 50),
      City: input.address.city.substring(0, 50),
      State: input.address.state.substring(0, 50),
      Country: (input.address.country || 'India').substring(0, 50),
      ZipCode: input.address.zipCode.substring(0, 10),
      Zone: (input.address.zone || 'Default').substring(0, 50),
      UnitNo: unitNumbers.join(','),
    };

    for (const [key, value] of Object.entries(address)) {
      formData.append(`Address[${key}]`, value);
    }

    // Append images (matching RN app format: NKPropertyImages[0].PropertyImages)
    if (imageFiles && imageFiles.length > 0) {
      formData.append('NKPropertyImages[0].unitNo', '1');
      for (const file of imageFiles) {
        formData.append('NKPropertyImages[0].PropertyImages', file, file.name);
      }
    }

    const fullUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY.CREATE}`;

    const response = await fetch(fullUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Azure returns validation errors in { errors: { "Field": ["message"] } } format
      let message = 'Failed to create property';
      if (data.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        if (typeof firstError === 'string') message = firstError;
      }
      throw ApiError.fromHttpStatus(response.status, message);
    }

    // Azure returns { model: [propId, ...], isAuthorized, apiErrors, mobileUser }
    if (data.apiErrors && data.apiErrors.length > 0) {
      let errorMsg = data.apiErrors[0];
      // Surface clean messages instead of raw SQL/server exceptions
      if (errorMsg.includes('truncated')) {
        errorMsg = 'One or more fields are too long. Please shorten your address or property details.';
      } else if (errorMsg.includes('SqlException') || errorMsg.includes('Microsoft.Data')) {
        errorMsg = 'A server error occurred. Please try again.';
      }
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: errorMsg,
        retryable: false,
      });
    }

    const propertyIds: number[] = data.model || [];

    return {
      success: true,
      message: 'Property created successfully',
      propertyId: propertyIds[0],
    };
  }

  /**
   * Get available filter options
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const { data } = await httpClient.get<FiltersResponse>(
      API_CONFIG.ENDPOINTS.PROPERTY.FILTER_RANGE
    );

    if (!data.success) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: data.message || 'Failed to fetch filter options',
        retryable: true,
      });
    }

    const options: FilterOptions = {
      bedrooms: [],
      price: [],
      area: [],
      parking: [],
      water: [],
      category: [],
    };

    for (const filter of data.model || []) {
      const key = filter.key.toLowerCase();
      if (key === 'bedrooms' || key === 'bedroom') {
        options.bedrooms = filter.values;
      } else if (key === 'rent') {
        options.price = filter.values;
      } else if (key === 'area') {
        options.area = filter.values;
      } else if (key === 'parking') {
        options.parking = filter.values;
      } else if (key === 'water') {
        options.water = filter.values;
      } else if (key === 'category' || key === 'type') {
        options.category = filter.values;
      }
    }

    return options;
  }
}

// Singleton instance
export const propertyService = new PropertyService();

// Export the class for testing purposes
export { PropertyService };

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
  CreatePropertyRequest,
  CreatePropertyResponse,
  FiltersResponse,
} from '../types';

// Service interface - allows for easy mocking and testing
export interface IPropertyService {
  getProperties(params?: PropertyQueryParams): Promise<PropertyListResponse>;
  getPropertyById(id: string): Promise<Property>;
  searchProperties(params: PropertySearchParams): Promise<PropertyListResponse>;
  createProperty(data: CreatePropertyInput): Promise<CreatePropertyResult>;
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
  rent: number;
  deposit: number;
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
  images?: Array<{ uri: string; name: string; type: string }>;
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
  rent: string[];
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
    if (filters.furnishing && filters.furnishing.length > 0) {
      // Map furnishing to appropriate field if needed
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
   */
  async createProperty(input: CreatePropertyInput): Promise<CreatePropertyResult> {
    const request: CreatePropertyRequest = {
      UserEmail: input.userEmail,
      UnitNo: [],
      PropertyInformation: {
        propertyName: input.propertyName,
        bedRooms: String(input.bedrooms),
        rent: input.rent,
        deposit: input.deposit,
        isNegotiable: input.isNegotiable || false,
        area: String(input.area),
        baths: String(input.bathrooms),
        isFurnished: input.isFurnished || false,
        comments: input.comments || '',
        Parking: input.parking || 'None',
        Water: input.water || 'Municipal',
        Electricity: input.electricity || 'Available',
        Category: input.category || 'Apartment',
        createdOn: new Date().toISOString(),
      },
      Address: {
        AddressLine1: input.address.addressLine1,
        AddressLine2: input.address.addressLine2,
        City: input.address.city,
        State: input.address.state,
        Country: input.address.country || 'India',
        ZipCode: input.address.zipCode,
        Zone: input.address.zone,
        createdOn: new Date().toISOString(),
      },
    };

    // Handle images if provided
    if (input.images && input.images.length > 0) {
      request.NKPropertyImages = [
        {
          UnitNo: '',
          PropertyImages: input.images,
        },
      ];
    }

    const { data } = await httpClient.post<CreatePropertyResponse>(
      API_CONFIG.ENDPOINTS.PROPERTY.CREATE,
      request
    );

    if (!data.success) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: data.message || 'Failed to create property',
        retryable: false,
      });
    }

    return {
      success: true,
      message: data.message || 'Property created successfully',
      propertyId: data.propertyID,
    };
  }

  /**
   * Get available filter options
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const { data } = await httpClient.post<FiltersResponse>(
      API_CONFIG.ENDPOINTS.PROPERTY.FILTER_RANGE,
      {}
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
      rent: [],
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
        options.rent = filter.values;
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

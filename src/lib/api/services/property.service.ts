/**
 * Property Service - BB self-contained property operations
 * Uses /api/bb/property/* endpoints
 */

import { httpClient } from '../http-client';
import { API_CONFIG } from '../config';
import { ApiError } from '../errors';
import { mapPropertyFromBBResponse } from '../mappers';
import type { Property, PropertyFilters, PropertyListResponse, PaginationMeta } from '@/types/property.types';
import type {
  BBPropertyResponse,
  BBPropertySearchRequest,
  BBPaginatedResponse,
  BBSingleResponse,
  BBFilterRangeResponse,
} from '../types';

// Service interface - allows for easy mocking and testing
export interface IPropertyService {
  getProperties(params?: PropertyQueryParams): Promise<PropertyListResponse>;
  getPropertyById(id: string): Promise<Property>;
  searchProperties(params: PropertySearchParams): Promise<PropertyListResponse>;
  createProperty(data: CreatePropertyInput, userId?: string, imageCount?: number): Promise<CreatePropertyResult>;
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
  isFeatured?: boolean;
  comments?: string;
  parking?: string;
  water?: string;
  electricity?: string;
  category?: string;
  builderId?: string;
  facing?: string;
  plotLength?: number;
  plotWidth?: number;
  plotApprovalType?: string;
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
  cities: string[];
  types: string[];
  minRent: number;
  maxRent: number;
}

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/**
 * Property Service Implementation - BB self-contained
 */
class PropertyService implements IPropertyService {
  /**
   * Get paginated list of approved properties
   */
  async getProperties(params: PropertyQueryParams = {}): Promise<PropertyListResponse> {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;

    const { data } = await httpClient.get<BBPaginatedResponse<BBPropertyResponse>>(
      `${API_CONFIG.ENDPOINTS.PROPERTY.LIST}?page=${page}&limit=${limit}`
    );

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: data.apiErrors[0] || 'Failed to fetch properties',
        retryable: true,
      });
    }

    const items = data.model?.data || [];
    const pag = data.model?.pagination;

    const properties = items.map(mapPropertyFromBBResponse);

    const pagination: PaginationMeta = {
      page: pag?.page || page,
      limit: pag?.limit || limit,
      total: pag?.total || 0,
      totalPages: pag?.totalPages || 0,
      hasNext: (pag?.page || page) < (pag?.totalPages || 0),
      hasPrev: (pag?.page || page) > 1,
    };

    return {
      data: properties,
      pagination,
      filters: {},
    };
  }

  /**
   * Get a single property by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    const { data } = await httpClient.get<BBSingleResponse<BBPropertyResponse>>(
      API_CONFIG.ENDPOINTS.PROPERTY.DETAIL(id)
    );

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw new ApiError({
        code: 'NOT_FOUND',
        message: data.apiErrors[0] || 'Property not found',
        status: 404,
        retryable: false,
      });
    }

    if (!data.model) {
      throw new ApiError({
        code: 'NOT_FOUND',
        message: 'Property not found',
        status: 404,
        retryable: false,
      });
    }

    return mapPropertyFromBBResponse(data.model);
  }

  /**
   * Search properties with filters
   */
  async searchProperties(params: PropertySearchParams): Promise<PropertyListResponse> {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      sortField = 'CreatedAt',
      sortOrder = 'desc',
      query,
      filters,
    } = params;

    const searchRequest: BBPropertySearchRequest = {
      page,
      limit,
      sortField,
      sortOrder,
      query: query || undefined,
    };

    // Apply filters
    if (filters) {
      if (filters.type && filters.type.length > 0) {
        searchRequest.type = filters.type[0];
      }
      if (filters.city) {
        searchRequest.city = filters.city;
      }
      if (filters.bedrooms && filters.bedrooms.length > 0) {
        searchRequest.bedRooms = String(filters.bedrooms[0]);
      }
      if (filters.minPrice !== undefined) {
        searchRequest.minRent = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        searchRequest.maxRent = filters.maxPrice;
      }
      if (filters.featured) {
        searchRequest.isFeatured = true;
      }
      if (filters.furnishing && filters.furnishing.length > 0) {
        searchRequest.isFurnished = filters.furnishing.includes('furnished');
      }
    }

    const { data } = await httpClient.post<BBPaginatedResponse<BBPropertyResponse>>(
      API_CONFIG.ENDPOINTS.PROPERTY.SEARCH,
      searchRequest
    );

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: data.apiErrors[0] || 'Failed to search properties',
        retryable: true,
      });
    }

    const items = data.model?.data || [];
    const pag = data.model?.pagination;

    const properties = items.map(mapPropertyFromBBResponse);

    const pagination: PaginationMeta = {
      page: pag?.page || page,
      limit: pag?.limit || limit,
      total: pag?.total || 0,
      totalPages: pag?.totalPages || 0,
      hasNext: (pag?.page || page) < (pag?.totalPages || 0),
      hasPrev: (pag?.page || page) > 1,
    };

    return {
      data: properties,
      pagination,
      filters: filters || {},
    };
  }

  /**
   * Create a new property listing via BB endpoint
   * Now forwards to the proxy route which handles multipart/FormData forwarding to backend.
   * @param input - property data
   * @param userId - BB user ID (passed from proxy route header)
   * @param imageCount - number of images (for fallback/non-multipart calls)
   */
  async createProperty(input: CreatePropertyInput, userId?: string, imageCount?: number): Promise<CreatePropertyResult> {
    const body = {
      propertyName: input.propertyName,
      type: input.category || 'apartment',
      category: input.category || 'apartment',
      bedRooms: String(input.bedrooms),
      baths: String(input.bathrooms),
      rent: input.price,
      deposit: 0,
      area: input.area,
      isNegotiable: input.isNegotiable || false,
      isFurnished: input.isFurnished || false,
      comments: input.comments || '',
      parking: input.parking || 'None',
      water: input.water || 'Municipal',
      electricity: input.electricity || 'Available',
      noOfImages: imageCount ?? 0,
      addressLine1: input.address.addressLine1,
      addressLine2: input.address.addressLine2 || '',
      city: input.address.city,
      state: input.address.state,
      country: input.address.country || 'India',
      zipCode: input.address.zipCode,
      zone: input.address.zone || '',
      builderId: input.builderId || null,
      facing: input.facing || null,
      plotLength: input.plotLength || null,
      plotWidth: input.plotWidth || null,
      plotApprovalType: input.plotApprovalType || null,
    };

    const headers: Record<string, string> = {};
    if (userId) {
    }

    const { data } = await httpClient.post<BBSingleResponse<{ bbPropertyId: number }>>(
      API_CONFIG.ENDPOINTS.PROPERTY.CREATE,
      body,
      { headers }
    );

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: data.apiErrors[0] || 'Validation failed',
        retryable: false,
      });
    }

    return {
      success: true,
      message: 'Property created successfully',
      propertyId: data.model?.bbPropertyId,
    };
  }

  /**
   * Create a property with images via FormData.
   * Sends multipart/form-data directly to the backend.
   */
  async createPropertyWithImages(
    input: CreatePropertyInput,
    images: File[],
    userId?: string,
  ): Promise<CreatePropertyResult> {
    const body = {
      propertyName: input.propertyName,
      type: input.category || 'apartment',
      category: input.category || 'apartment',
      bedRooms: String(input.bedrooms),
      baths: String(input.bathrooms),
      rent: input.price,
      deposit: 0,
      area: input.area,
      isNegotiable: input.isNegotiable || false,
      isFurnished: input.isFurnished || false,
      comments: input.comments || '',
      parking: input.parking || 'None',
      water: input.water || 'Municipal',
      electricity: input.electricity || 'Available',
      noOfImages: images.length,
      addressLine1: input.address.addressLine1,
      addressLine2: input.address.addressLine2 || '',
      city: input.address.city,
      state: input.address.state,
      country: input.address.country || 'India',
      zipCode: input.address.zipCode,
      zone: input.address.zone || '',
      builderId: input.builderId || null,
      facing: input.facing || null,
      plotLength: input.plotLength || null,
      plotWidth: input.plotWidth || null,
      plotApprovalType: input.plotApprovalType || null,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(body));
    for (const file of images) {
      formData.append('images', file);
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (userId) {
    }

    const fullUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY.CREATE}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw new ApiError({
        code: 'VALIDATION_ERROR',
        message: data.apiErrors[0] || 'Validation failed',
        retryable: false,
      });
    }

    return {
      success: true,
      message: 'Property created successfully',
      propertyId: data.model?.bbPropertyId,
    };
  }

  /**
   * Get available filter options from BB
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const { data } = await httpClient.get<BBSingleResponse<BBFilterRangeResponse>>(
      API_CONFIG.ENDPOINTS.PROPERTY.FILTER_RANGE
    );

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw new ApiError({
        code: 'SERVER_ERROR',
        message: data.apiErrors[0] || 'Failed to fetch filter options',
        retryable: true,
      });
    }

    const range = data.model;

    return {
      bedrooms: range?.bedRooms || [],
      price: range ? [String(range.minRent), String(range.maxRent)] : [],
      area: [],
      parking: [],
      water: [],
      category: range?.categories || [],
      cities: range?.cities || [],
      types: range?.types || [],
      minRent: range?.minRent || 0,
      maxRent: range?.maxRent || 0,
    };
  }
}

// Singleton instance
export const propertyService = new PropertyService();

// Export the class for testing purposes
export { PropertyService };

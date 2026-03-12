/**
 * API Module - Central export for all API-related utilities
 */

// Configuration
export { API_CONFIG } from './config';

// HTTP Client
export { httpClient, httpRequest } from './http-client';
export type { RequestConfig, HttpResponse } from './http-client';

// Errors
export { ApiError, isApiError } from './errors';
export type { ApiErrorCode, ApiErrorDetails } from './errors';

// Services
export { propertyService, PropertyService } from './services/property.service';
export { authService, mapMobileUserToUser, mapBBUserToUser } from './authService';
export { contactService } from './services/contact.service';
export { favoritesService } from './services/favorites.service';
export { enquiryService } from './services/enquiry.service';
export { hometourService } from './services/hometour.service';
export { builderService } from './services/builder.service';
export { adminService } from './services/admin.service';
export type {
  IPropertyService,
  PropertyQueryParams,
  PropertySearchParams,
  CreatePropertyInput,
  CreatePropertyResult,
  FilterOptions,
} from './services/property.service';

// Types
export type {
  ExternalApiResponse,
  ExternalPropertyListItem,
  ExternalPropertyDetail,
  ExternalPropertyDetailResponse,
  PropertySearchRequest,
  FilterOption,
  FiltersResponse,
} from './types';

// Mappers
export { mapPropertyFromListItem, mapPropertyFromDetail, mapPropertyFromBBResponse } from './mappers';

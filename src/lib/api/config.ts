/**
 * API Configuration - Single source of truth for API settings
 * Following Single Responsibility Principle (SRP)
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://nammakutiraweb.azurewebsites.net',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  ENDPOINTS: {
    PROPERTY: {
      LIST: '/api/property/propertyInformation',
      SEARCH: '/api/property/propertyInformation/searchProperty',
      CREATE: '/api/property/addPropdetails',
      DETAIL: (id: string | number) => `/api/property/${id}`,
      FILTER_RANGE: '/api/property/filterRange',
      HOME_TOUR: '/api/property/hometour/request',
    },
    AUTH: {
      GENERATE_OTP: '/api/user/sms/generateAndSendOTPJson?countries=india',
      VALIDATE_OTP: '/api/user/sms/validateOTPJson',
      CREATE_USER: '/api/user/Create/',
      VALIDATE_PASSWORD: '/api/user/validatePassword',
      VALIDATE_MEMBER: '/api/user/validatemember',
    },
    AGENT: {
      DETAILS: '/api/agent/agencydetails',
      CREATE: '/api/agent/Create',
    },
  },
} as const;

export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;

// Convenience export for base URL access
export const apiConfig = {
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  endpoints: API_CONFIG.ENDPOINTS,
};

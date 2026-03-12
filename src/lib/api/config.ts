/**
 * API Configuration - Single source of truth for API settings
 * Following Single Responsibility Principle (SRP)
 */

export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'https://nammakutiraweb.azurewebsites.net',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  ENDPOINTS: {
    // BB self-contained property endpoints
    PROPERTY: {
      LIST: '/api/bb/property/list',
      SEARCH: '/api/bb/property/search',
      CREATE: '/api/bb/property',
      DETAIL: (id: string | number) => `/api/bb/property/${id}`,
      FILTER_RANGE: '/api/bb/property/filterRange',
    },
    // BB self-contained auth endpoints
    AUTH: {
      REGISTER: '/api/bb/auth/register',
      LOGIN: '/api/bb/auth/login',
      ADMIN_LOGIN: '/api/bb/auth/admin/login',
    },
    // Legacy NK endpoints (kept for reference)
    NK_AUTH: {
      GENERATE_OTP: '/api/user/sms/generateAndSendOTPJson?countries=india',
      VALIDATE_OTP: '/api/user/sms/validateOtpJson',
      CREATE_USER: '/api/user/Create/',
      VALIDATE_PASSWORD: '/api/user/validatemember',
    },
    AGENT: {
      DETAILS: '/api/agent/agencydetails',
      CREATE: '/api/agent/Create',
    },
    BB_BUILDER: {
      LIST: '/api/builder',
      BY_SLUG: (slug: string) => `/api/builder/${slug}`,
    },
    BB_FAVORITES: {
      LIST: '/api/favorites',
      ADD: '/api/favorites',
      REMOVE: '/api/favorites',
    },
    BB_ENQUIRY: {
      SEND: '/api/enquiry',
      SENT: '/api/enquiry/sent',
      RECEIVED: '/api/enquiry/received',
      RESPOND: (id: number) => `/api/enquiry/${id}/respond`,
    },
    BB_CONTACT: {
      SUBMIT: '/api/contact',
    },
    BB_ANALYTICS: {
      PROPERTY_VIEW: '/api/analytics/property-view',
      HOME_TOUR: (propertyId: number) => `/api/property/${propertyId}/hometour`,
      CONTACT_VIEW: (propertyId: number) => `/api/property/${propertyId}/contact-view`,
    },
    BB_ADMIN: {
      PROPERTIES: '/api/bb/admin/properties',
      APPROVE: (id: number) => `/api/bb/admin/properties/${id}/approve`,
      REJECT: (id: number) => `/api/bb/admin/properties/${id}/reject`,
      ANALYTICS: '/api/bb/admin/analytics',
      CONTACT_ENQUIRIES: '/api/bb/admin/contact-enquiries',
      CONTACT_STATUS: (id: number) => `/api/bb/admin/contact-enquiries/${id}/status`,
      BUILDERS_CREATE: '/api/bb/admin/builders',
      BUILDERS_UPDATE: (id: string) => `/api/bb/admin/builders/${id}`,
      BUILDERS_DELETE: (id: string) => `/api/bb/admin/builders/${id}`,
      BUILDERS_LOGO: (id: string) => `/api/bb/admin/builders/${id}/logo`,
    },
    BB_USER: {
      AVATAR: '/api/bb/user/avatar',
    },
  },
  ADMIN_KEY: process.env.BB_ADMIN_KEY ?? '',
} as const;

export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;

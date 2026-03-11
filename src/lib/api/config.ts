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
      PROPERTIES: '/api/admin/properties',
      APPROVE: (id: number) => `/api/admin/properties/${id}/approve`,
      REJECT: (id: number) => `/api/admin/properties/${id}/reject`,
      ANALYTICS: '/api/admin/analytics/summary',
      CONTACT_ENQUIRIES: '/api/admin/contact-enquiries',
      CONTACT_STATUS: (id: number) => `/api/admin/contact-enquiries/${id}/status`,
      BUILDERS_CREATE: '/api/admin/builders',
      BUILDERS_UPDATE: (id: string) => `/api/admin/builders/${id}`,
      BUILDERS_DELETE: (id: string) => `/api/admin/builders/${id}`,
    },
  },
  ADMIN_KEY: process.env.BB_ADMIN_KEY || '',
} as const;

export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;

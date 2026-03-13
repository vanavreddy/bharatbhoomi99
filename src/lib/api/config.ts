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
      MY: '/api/bb/property/my',
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
      PROPERTY_DETAIL: (id: number) => `/api/bb/admin/properties/${id}`,
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
    BB_TEAM: {
      STATUS: '/api/bb/admin/team/status',
      BOOTSTRAP: '/api/bb/admin/team/bootstrap',
      LOGIN: '/api/bb/admin/team/login',
      MEMBERS: '/api/bb/admin/team/members',
      MEMBER_ROLE: (id: number) => `/api/bb/admin/team/members/${id}/role`,
      MEMBER_STATUS: (id: number) => `/api/bb/admin/team/members/${id}/status`,
      INVITES: '/api/bb/admin/team/invites',
      INVITE_VALIDATE: (token: string) => `/api/bb/admin/team/invites/${token}/validate`,
      INVITE_ACCEPT: (token: string) => `/api/bb/admin/team/invites/${token}/accept`,
      INVITE_REVOKE: (id: number) => `/api/bb/admin/team/invites/${id}`,
    },
    BB_USER: {
      PROFILE: '/api/bb/user/profile',
      CHANGE_PASSWORD: '/api/bb/user/change-password',
      AVATAR: '/api/bb/user/avatar',
    },
  },
  ADMIN_KEY: process.env.BB_ADMIN_KEY ?? '',
} as const;

export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;

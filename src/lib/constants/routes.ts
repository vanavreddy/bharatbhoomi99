/**
 * Application route constants
 */

export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: (id: string) => `/properties/${id}`,
  LIST_PROPERTY: '/list-property',
  CONTACT: '/contact',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  PROFILE: '/profile',
  MY_PROPERTIES: '/my-properties',
} as const;

export const API_ROUTES = {
  AUTH: {
    SIGN_IN: '/api/auth/signin',
    SIGN_UP: '/api/auth/signup',
    SIGN_OUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
  },
  PROPERTIES: {
    LIST: '/api/properties',
    DETAIL: (id: string) => `/api/properties/${id}`,
    SEARCH: '/api/properties/search',
    FEATURED: '/api/properties/featured',
  },
  CONTACT: '/api/contact',
  UPLOAD: '/api/upload',
} as const;

export const NAV_ITEMS = [
  { label: 'Buy', href: `${ROUTES.PROPERTIES}?type=buy` },
  { label: 'Rent', href: `${ROUTES.PROPERTIES}?type=rent` },
  { label: 'PG/Co-living', href: `${ROUTES.PROPERTIES}?type=pg` },
  { label: 'Commercial', href: `${ROUTES.PROPERTIES}?type=commercial` },
] as const;

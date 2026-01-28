/**
 * SEO constants and default metadata
 */

export const SITE_CONFIG = {
  name: 'Bharat Bhoomi-99',
  tagline: 'Real Estate | Builders | Construction',
  description:
    'Discover thousands of rental properties across India. Find apartments, houses, PGs, and commercial spaces. Verified listings, transparent pricing, and trusted owners.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://bharatbhoomi99.com',
  ogImage: '/images/og/default.jpg',
  twitterHandle: '@bharatbhoomi99',
  locale: 'en_IN',
  country: 'India',
} as const;

export const DEFAULT_KEYWORDS = [
  'property rental India',
  'flats for rent',
  'houses for rent',
  'PG accommodation',
  'rental properties',
  'apartments for rent',
  'Bharat Bhoomi',
  'real estate India',
  'property listing',
  'rent house India',
] as const;

export const PAGE_TITLES = {
  home: 'Find Your Perfect Rental Property in India',
  properties: 'Browse Properties',
  listProperty: 'List Your Property',
  contact: 'Contact Us',
  signIn: 'Sign In',
  signUp: 'Create Account',
  notFound: 'Page Not Found',
} as const;

export const PAGE_DESCRIPTIONS = {
  home: 'Discover thousands of rental properties across India. Find apartments, houses, PGs, and commercial spaces. Verified listings, transparent pricing, and trusted owners.',
  properties:
    'Search and filter through our extensive collection of rental properties. Apartments, houses, villas, PGs, and commercial spaces available across all major Indian cities.',
  listProperty:
    "List your property for rent on Bharat Bhoomi-99. Reach thousands of potential tenants. Free listing, verified tenants, and hassle-free process.",
  contact:
    "Get in touch with Bharat Bhoomi-99. We're here to help with your property rental needs. Reach out for support, inquiries, or feedback.",
  signIn: 'Sign in to your Bharat Bhoomi-99 account to manage your properties and saved listings.',
  signUp: 'Join Bharat Bhoomi-99 to list properties, save favorites, and connect with property owners.',
} as const;

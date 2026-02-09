/**
 * SEO constants and default metadata
 */

export const SITE_CONFIG = {
  name: 'Bharat Bhoomi-99',
  tagline: 'Real Estate | Builders | Construction',
  description:
    'Discover thousands of rental properties across India. Find apartments, houses, villas, and commercial spaces. Verified listings, transparent pricing, and trusted owners.',
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
  'rental properties',
  'apartments for rent',
  'Bharat Bhoomi',
  'real estate India',
  'property listing',
  'rent house India',
  'Bangalore real estate',
  'family realtor',
  'Chandapura real estate',
  'Dommasandra property',
  'Electronic City homes',
  'Kommasandra property',
  'property buy sell rent Bangalore',
  'Bangalore builders',
  'real estate agent Bangalore',
] as const;

export const PAGE_TITLES = {
  home: 'Find Your Perfect Rental Property in India',
  properties: 'Browse Properties',
  listProperty: 'List Your Property',
  contact: 'Contact Us',
  about: 'About Us',
  signIn: 'Sign In',
  signUp: 'Create Account',
  notFound: 'Page Not Found',
  builders: 'Popular Builders in Bangalore',
  builderDetail: (name: string) => `${name} - Builder Profile`,
  help: 'Help Center',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
} as const;

export const PAGE_DESCRIPTIONS = {
  home: 'Discover thousands of rental properties across India. Find apartments, houses, villas, and commercial spaces. Verified listings, transparent pricing, and trusted owners.',
  properties:
    'Search and filter through our extensive collection of rental properties. Apartments, houses, villas, and commercial spaces available across all major Indian cities.',
  listProperty:
    "List your property for rent on Bharat Bhoomi-99. Reach thousands of potential tenants. Free listing, verified tenants, and hassle-free process.",
  contact:
    "Get in touch with Bharat Bhoomi-99. We're here to help with your property rental needs. Reach out for support, inquiries, or feedback.",
  about:
    'Learn about Bharat Bhoomi-99 and Madhu Chandra, your trusted family realtor in Bangalore with over 5 years of experience in real estate, construction, and builders.',
  signIn: 'Sign in to your Bharat Bhoomi-99 account to manage your properties and saved listings.',
  signUp: 'Join Bharat Bhoomi-99 to list properties, save favorites, and connect with property owners.',
  builders:
    "Explore premium properties from Bangalore's most trusted real estate developers. Find your dream home from builders like Prestige, Brigade, Sobha, and more.",
  help: 'Get help with using Bharat Bhoomi-99. Find answers to common questions about property listings, account management, and more.',
} as const;

import { z } from 'zod';
import { priceSchema, areaSchema, pincodeSchema } from './schemas';

export const propertyTypeSchema = z.enum([
  'apartment',
  'house',
  'villa',
  'plot',
  'commercial',
  'pg',
]);

export const listingTypeSchema = z.enum(['sale']);

export const furnishingSchema = z.enum(['furnished', 'semi-furnished', 'unfurnished']);

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required').max(200),
  locality: z.string().min(1, 'Locality is required').max(100),
  city: z.string().min(1, 'City is required').max(50),
  state: z.string().min(1, 'State is required').max(50),
  pincode: pincodeSchema,
  landmark: z.string().max(200).optional(),
});

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  type: propertyTypeSchema,
  listingType: listingTypeSchema,
  price: priceSchema,
  area: areaSchema,
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(1).max(20),
  balconies: z.number().min(0).max(10).optional(),
  floor: z.number().min(-2).max(100).optional(),
  totalFloors: z.number().min(1).max(100).optional(),
  facing: z.string().max(20).optional(),
  furnishing: furnishingSchema,
  ageOfProperty: z.number().min(0).max(100).optional(),
  availableFrom: z.string(),
  address: addressSchema,
  amenityIds: z.array(z.string()).min(1, 'Select at least one amenity'),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyFiltersSchema = z.object({
  type: z.array(propertyTypeSchema).optional(),
  listingType: listingTypeSchema.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.array(z.number()).optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  furnishing: z.array(furnishingSchema).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'date_newest', 'date_oldest']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyFiltersInput = z.infer<typeof propertyFiltersSchema>;

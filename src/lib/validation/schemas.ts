import { z } from 'zod';

/**
 * Reusable validation schemas for form validation
 */

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const pincodeSchema = z
  .string()
  .length(6, 'Pincode must be 6 digits')
  .regex(/^\d{6}$/, 'Please enter a valid pincode');

export const priceSchema = z
  .number()
  .min(0, 'Price cannot be negative')
  .max(100000000000, 'Price exceeds maximum limit');

export const areaSchema = z
  .number()
  .min(1, 'Area must be at least 1 sq.ft.')
  .max(1000000, 'Area exceeds maximum limit');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

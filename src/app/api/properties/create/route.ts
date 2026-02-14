/**
 * Create Property API Route - POST /api/properties/create
 * Handles property creation with image uploads via multipart/form-data
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertyService, CreatePropertyInput } from '@/lib/api';
import { isApiError } from '@/lib/api/errors';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema for property creation
const createPropertySchema = z.object({
  userEmail: z.string().email('Valid email is required'),
  propertyName: z.string().min(3, 'Property name must be at least 3 characters'),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(10),
  rent: z.number().positive('Rent must be positive'),
  deposit: z.number().min(0),
  area: z.number().positive('Area must be positive'),
  isNegotiable: z.boolean().optional(),
  isFurnished: z.boolean().optional(),
  comments: z.string().optional(),
  parking: z.string().optional(),
  water: z.string().optional(),
  electricity: z.string().optional(),
  category: z.string().optional(),
  address: z.object({
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().optional(),
    zipCode: z.string().min(1, 'Pincode is required'),
    zone: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let body: unknown;
    let imageFiles: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      // Parse multipart FormData (supports image uploads)
      const formData = await request.formData();
      const dataField = formData.get('data');
      if (typeof dataField === 'string') {
        body = JSON.parse(dataField);
      }
      // Extract image files
      imageFiles = formData
        .getAll('images')
        .filter((f): f is File => f instanceof File);
    } else {
      // Fallback: parse JSON body (no images)
      body = await request.json().catch(() => null);
    }

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request body is required',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate request body
    const validation = createPropertySchema.safeParse(body);

    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const input: CreatePropertyInput = validation.data;
    const result = await propertyService.createProperty(input, imageFiles.length > 0 ? imageFiles : undefined);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: result.message,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          propertyId: result.propertyId,
          message: result.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating property:', error);

    if (isApiError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
          timestamp: new Date().toISOString(),
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Create Property API Route - POST /api/properties/create
 * Handles property creation with optional image uploads.
 * - No images: sends JSON to backend (backward compatible)
 * - With images: sends multipart/form-data to backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { isApiError } from '@/lib/api/errors';
import { API_CONFIG } from '@/lib/api/config';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema for property creation
const createPropertySchema = z.object({
  userEmail: z.string().email('Valid email is required'),
  propertyName: z.string().min(1, 'Property name is required'),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(10),
  price: z.number().positive('Price must be positive'),
  area: z.number().positive('Area must be positive'),
  isNegotiable: z.boolean().optional(),
  isFurnished: z.boolean().optional(),
  comments: z.string().optional(),
  parking: z.string().optional(),
  water: z.string().optional(),
  electricity: z.string().optional(),
  category: z.string().optional(),
  builderId: z.string().optional(),
  facing: z.string().optional(),
  plotLength: z.number().min(0, 'Plot length cannot be negative').optional(),
  plotWidth: z.number().min(0, 'Plot width cannot be negative').optional(),
  plotApprovalType: z.string().optional(),
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
    const userId = request.headers.get('X-BB-User-Id') || undefined;

    let body: unknown;
    let imageFiles: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const dataField = formData.get('data');
      if (typeof dataField === 'string') {
        body = JSON.parse(dataField);
      }
      imageFiles = formData.getAll('images').filter((f): f is File => f instanceof File);
    } else {
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

    const input = validation.data;

    // Build the backend request body (maps frontend field names to backend field names)
    const backendData = {
      propertyName: input.propertyName,
      type: input.category || 'apartment',
      category: input.category || 'apartment',
      bedRooms: String(input.bedrooms),
      baths: String(input.bathrooms),
      rent: input.price,
      deposit: 0,
      area: input.area,
      isNegotiable: input.isNegotiable || false,
      isFurnished: input.isFurnished || false,
      comments: input.comments || '',
      parking: input.parking || 'None',
      water: input.water || 'Municipal',
      electricity: input.electricity || 'Available',
      noOfImages: imageFiles.length,
      addressLine1: input.address.addressLine1,
      addressLine2: input.address.addressLine2 || '',
      city: input.address.city,
      state: input.address.state,
      country: input.address.country || 'India',
      zipCode: input.address.zipCode,
      zone: input.address.zone || '',
      builderId: input.builderId || null,
      facing: input.facing || null,
      plotLength: input.plotLength || null,
      plotWidth: input.plotWidth || null,
      plotApprovalType: input.plotApprovalType || null,
    };

    const backendUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY.CREATE}`;
    const headers: Record<string, string> = {};
    if (userId) {
      headers['X-BB-User-Id'] = userId;
    }

    let response: Response;

    if (imageFiles.length > 0) {
      // With images: send multipart/form-data
      const backendFormData = new FormData();
      backendFormData.append('data', JSON.stringify(backendData));
      for (const file of imageFiles) {
        backendFormData.append('images', file);
      }
      response = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: backendFormData,
      });
    } else {
      // No images: send JSON (backward compatible with production backend)
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
      response = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(backendData),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let message = 'Backend error';
      try {
        const errorJson = JSON.parse(errorText);
        message = errorJson.apiErrors?.[0] || errorJson.message || message;
      } catch {
        // Backend returned non-JSON (e.g. HTML error page)
        message = `Backend returned status ${response.status}`;
      }
      return NextResponse.json(
        {
          success: false,
          error: { code: 'SERVER_ERROR', message },
          timestamp: new Date().toISOString(),
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.isAuthorized === false ? 'UNAUTHORIZED' : 'SERVER_ERROR',
            message: data.apiErrors[0],
          },
          timestamp: new Date().toISOString(),
        },
        { status: data.isAuthorized === false ? 401 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          propertyId: data.model?.bbPropertyId,
          message: 'Property created successfully',
          imageUrls: data.model?.imageUrls || [],
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

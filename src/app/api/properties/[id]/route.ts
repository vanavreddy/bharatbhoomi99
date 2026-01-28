/**
 * Property Detail API Route - GET /api/properties/[id]
 * Handles fetching a single property by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/api';
import { isApiError } from '@/lib/api/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Property ID is required',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const property = await propertyService.getPropertyById(id);

    return NextResponse.json({
      success: true,
      data: property,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching property:', error);

    if (isApiError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
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

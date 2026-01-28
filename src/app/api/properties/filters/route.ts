/**
 * Property Filters API Route - GET /api/properties/filters
 * Returns available filter options for property search
 */

import { NextResponse } from 'next/server';
import { propertyService } from '@/lib/api';
import { isApiError } from '@/lib/api/errors';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const filters = await propertyService.getFilterOptions();

    return NextResponse.json({
      success: true,
      data: filters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching filters:', error);

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

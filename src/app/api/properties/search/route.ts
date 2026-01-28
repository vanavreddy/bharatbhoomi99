/**
 * Properties Search API Route - POST /api/properties/search
 * Handles property search with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/api';
import { isApiError } from '@/lib/api/errors';
import type { PropertyFilters } from '@/types/property.types';

export const dynamic = 'force-dynamic';

interface SearchRequestBody {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  query?: string;
  filters?: PropertyFilters;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequestBody = await request.json().catch(() => ({}));

    const {
      page = 1,
      limit = 10,
      sortField = 'addCreatedOn',
      sortOrder = 'desc',
      query,
      filters,
    } = body;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid pagination parameters',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const result = await propertyService.searchProperties({
      page,
      limit,
      sortField,
      sortOrder,
      query,
      filters,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: result.filters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error searching properties:', error);

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

// Also support GET for simple searches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const bedrooms = searchParams.get('bedrooms');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const furnishing = searchParams.get('furnishing');

    // Build filters from query params
    const filters: PropertyFilters = {};

    if (type) {
      filters.type = type.split(',') as PropertyFilters['type'];
    }
    if (city) {
      filters.city = city;
    }
    if (bedrooms) {
      filters.bedrooms = bedrooms.split(',').map(Number);
    }
    if (minPrice) {
      filters.minPrice = parseInt(minPrice, 10);
    }
    if (maxPrice) {
      filters.maxPrice = parseInt(maxPrice, 10);
    }
    if (furnishing) {
      filters.furnishing = furnishing.split(',') as PropertyFilters['furnishing'];
    }

    const result = await propertyService.searchProperties({
      page,
      limit,
      query,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: result.filters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error searching properties:', error);

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

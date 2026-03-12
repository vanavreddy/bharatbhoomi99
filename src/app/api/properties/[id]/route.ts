/**
 * Property Detail API Route - GET /api/properties/[id]
 * Handles fetching a single property by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { isApiError } from '@/lib/api/errors';
import { API_CONFIG } from '@/lib/api/config';
import { mapPropertyFromBBResponse } from '@/lib/api/mappers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Forward X-BB-User-Id header so owner can view their own pending property
    const userId = request.headers.get('X-BB-User-Id');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userId) {
      headers['X-BB-User-Id'] = userId;
    }

    const backendUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY.DETAIL(id)}`;
    const backendResponse = await fetch(backendUrl, { headers });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: { code: 'SERVER_ERROR', message: errorData.apiErrors?.[0] || 'Backend error' },
          timestamp: new Date().toISOString(),
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: data.apiErrors[0] || 'Property not found' },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const property = data.model ? mapPropertyFromBBResponse(data.model) : null;
    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Property not found' },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

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

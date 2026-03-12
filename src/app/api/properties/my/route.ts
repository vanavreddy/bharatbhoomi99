/**
 * My Properties API Route - GET /api/properties/my
 * Returns all properties owned by the authenticated user (any status)
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'User ID is required' } },
        { status: 401 }
      );
    }

    const response = await fetch(`${BASE_URL}${ENDPOINTS.PROPERTY.MY}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-BB-User-Id': userId,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: { code: 'SERVER_ERROR', message: errorData.apiErrors?.[0] || 'Backend error' } },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVER_ERROR', message: data.apiErrors[0] } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.model?.data || [],
      total: data.model?.total || 0,
      pagination: data.model?.pagination || null,
    });
  } catch (error) {
    console.error('Error fetching my properties:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

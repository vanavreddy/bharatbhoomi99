/**
 * Admin Properties API Route - GET /api/admin/properties
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbAdminHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('X-BB-Admin-Key');
    if (!adminKey) {
      return NextResponse.json({ apiErrors: ['Admin key required'] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.PROPERTIES}?status=${status}`,
      { headers: bbAdminHeaders() }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch properties'] }, { status: 500 });
  }
}

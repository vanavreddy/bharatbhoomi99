/**
 * Admin Properties API Route - GET /api/admin/properties
 * Proxies to BB admin properties endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';
import { validateAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.PROPERTIES}?status=${status}`,
      { headers: bbTeamHeaders(request) }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch properties'] }, { status: 500 });
  }
}

/**
 * GET /api/admin/users — paged, searchable user list for the admin panel.
 * Requires manage_users, enforced by the backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/bb/admin/users${query ? `?${query}` : ''}`,
      { cache: 'no-store', headers: bbTeamHeaders(request) }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to fetch users', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch users'] }, { status: 500 });
  }
}

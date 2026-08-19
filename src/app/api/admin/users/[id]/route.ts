/**
 * GET /api/admin/users/[id] — one user with their listings.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/bb/admin/users/${id}`, {
      cache: 'no-store',
      headers: bbTeamHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to fetch user', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch the user'] }, { status: 500 });
  }
}

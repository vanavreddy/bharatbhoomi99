/**
 * PATCH /api/admin/properties/[id]/feature — toggle a listing's featured flag.
 * Requires the feature_properties permission, enforced by the backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/bb/admin/properties/${id}/feature`, {
      method: 'PATCH',
      cache: 'no-store',
      headers: bbTeamHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to toggle featured', error);
    return NextResponse.json({ apiErrors: ['Failed to update the listing'] }, { status: 500 });
  }
}

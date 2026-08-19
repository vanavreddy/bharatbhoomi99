/**
 * PATCH /api/properties/[id]/hometour/[tourId]/status — owner responds to a
 * tour request (confirm, decline, complete).
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tourId: string }> }
) {
  try {
    const { id, tourId } = await params;
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/property/${id}/hometour/${tourId}/status`,
      {
        method: 'PATCH',
        cache: 'no-store',
        headers: bbHeaders(request),
        body: JSON.stringify(await request.json()),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to update tour status', error);
    return NextResponse.json({ apiErrors: ['Failed to update the tour request'] }, { status: 500 });
  }
}

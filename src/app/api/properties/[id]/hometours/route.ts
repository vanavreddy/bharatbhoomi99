/**
 * GET /api/properties/[id]/hometours — tour requests on a listing.
 * The backend restricts this to the listing's owner.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/property/${id}/hometours`, {
      cache: 'no-store',
      headers: bbHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to fetch tour requests', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch tour requests'] }, { status: 500 });
  }
}

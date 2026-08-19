/**
 * GET /api/user/hometours — tour requests the signed-in user has made.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/user/hometours`, {
      cache: 'no-store',
      headers: bbHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to fetch home tours', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch your tour requests'] }, { status: 500 });
  }
}

/**
 * Analytics API Route - POST /api/analytics/property-view
 * Proxies property view tracking to NammaKutira BB backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ANALYTICS.PROPERTY_VIEW}`,
      {
      cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error tracking property view:', error);
    return NextResponse.json(
      { apiErrors: ['Failed to track view'] },
      { status: 500 }
    );
  }
}

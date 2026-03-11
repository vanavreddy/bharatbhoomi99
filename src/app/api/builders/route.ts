/**
 * Builders API Route - GET /api/builders
 * Proxies builder list to NammaKutira BB backend
 */

import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET() {
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_BUILDER.LIST}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching builders:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch builders'] }, { status: 500 });
  }
}

/**
 * Builder Detail API Route - GET /api/builders/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_BUILDER.BY_SLUG(params.slug)}`,
      {
      cache: 'no-store', headers: { 'Content-Type': 'application/json' } }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching builder:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch builder'] }, { status: 500 });
  }
}

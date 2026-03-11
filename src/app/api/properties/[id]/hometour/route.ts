/**
 * Home Tour API Route - POST /api/properties/[id]/hometour
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbUserHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const body = await request.json();
    const propertyId = Number(params.id);

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ANALYTICS.HOME_TOUR(propertyId)}`,
      {
        method: 'POST',
        headers: bbUserHeaders(userId),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error requesting home tour:', error);
    return NextResponse.json({ apiErrors: ['Failed to request home tour'] }, { status: 500 });
  }
}

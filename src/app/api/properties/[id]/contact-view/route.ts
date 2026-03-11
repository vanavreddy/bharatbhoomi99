/**
 * Contact View API Route - POST /api/properties/[id]/contact-view
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
      `${BASE_URL}${ENDPOINTS.BB_ANALYTICS.CONTACT_VIEW(propertyId)}`,
      {
        method: 'POST',
        headers: bbUserHeaders(userId),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error recording contact view:', error);
    return NextResponse.json({ apiErrors: ['Failed to record contact view'] }, { status: 500 });
  }
}

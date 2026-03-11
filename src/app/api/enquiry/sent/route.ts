/**
 * Sent Enquiries API Route - GET /api/enquiry/sent
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbUserHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ENQUIRY.SENT}?userId=${userId}`,
      { headers: bbUserHeaders(userId) }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching sent enquiries:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch enquiries'] }, { status: 500 });
  }
}

/**
 * Enquiry API Route - POST /api/enquiry
 * Proxies enquiry submission to NammaKutira BB backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbUserHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ENQUIRY.SEND}`,
      {
        method: 'POST',
        headers: bbUserHeaders(userId),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error sending enquiry:', error);
    return NextResponse.json({ apiErrors: ['Failed to send enquiry'] }, { status: 500 });
  }
}

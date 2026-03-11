/**
 * Enquiry Respond API Route - PATCH /api/enquiry/[id]/respond
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbUserHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const body = await request.json();
    const enquiryId = Number(params.id);

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ENQUIRY.RESPOND(enquiryId)}`,
      {
        method: 'PATCH',
        headers: bbUserHeaders(userId),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error responding to enquiry:', error);
    return NextResponse.json({ apiErrors: ['Failed to respond to enquiry'] }, { status: 500 });
  }
}

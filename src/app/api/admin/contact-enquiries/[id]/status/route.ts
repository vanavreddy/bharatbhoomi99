import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbAdminHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.CONTACT_STATUS(Number(params.id))}`,
      { method: 'PATCH', headers: bbAdminHeaders(), body: JSON.stringify(body) }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json({ apiErrors: ['Failed to update status'] }, { status: 500 });
  }
}

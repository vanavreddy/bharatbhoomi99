import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbAdminHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET() {
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.ANALYTICS}`,
      { headers: bbAdminHeaders() }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch analytics'] }, { status: 500 });
  }
}

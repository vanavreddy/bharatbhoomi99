import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';
import { validateAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.PROPERTY_DETAIL(Number(params.id))}`,
      { headers: bbTeamHeaders(request) }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching property detail:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch property detail'] }, { status: 500 });
  }
}

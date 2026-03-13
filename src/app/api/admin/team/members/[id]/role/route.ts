import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';
import { validateAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ apiErrors: ['Invalid ID'] }, { status: 400 });
  }

  try {
    const body = await request.json();
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_TEAM.MEMBER_ROLE(id)}`,
      {
        method: 'PATCH',
        headers: bbTeamHeaders(request),
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to update role'] }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';

// Authorisation lives in the backend, not here.
//
// This route used to gate on `bb_admin_session`, an HMAC cookie minted by
// POST /api/admin/auth from the raw admin key --- with userId 0, so it never
// identified anyone. The backend now verifies a signed session, re-reads the
// caller's AdminTeamMembers row on every request, and checks the specific
// permission the endpoint needs. Keeping a second, weaker gate here only
// blocked team members who logged in the normal way.

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ apiErrors: ['Invalid ID'] }, { status: 400 });
  }

  try {
    const body = await request.json();
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_TEAM.MEMBER_STATUS(id)}`,
      {
      cache: 'no-store',
        method: 'PATCH',
        headers: bbTeamHeaders(request),
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to update status'] }, { status: 500 });
  }
}

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.BUILDERS_UPDATE(params.id)}`,
      {
      cache: 'no-store', method: 'PUT', headers: bbTeamHeaders(request), body: JSON.stringify(body) }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating builder:', error);
    return NextResponse.json({ apiErrors: ['Failed to update builder'] }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.BUILDERS_DELETE(params.id)}`,
      {
      cache: 'no-store', method: 'DELETE', headers: bbTeamHeaders(request) }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting builder:', error);
    return NextResponse.json({ apiErrors: ['Failed to delete builder'] }, { status: 500 });
  }
}

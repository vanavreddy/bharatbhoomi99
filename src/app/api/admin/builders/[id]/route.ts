import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';
import { validateAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.BUILDERS_UPDATE(params.id)}`,
      { method: 'PUT', headers: bbTeamHeaders(request), body: JSON.stringify(body) }
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
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_ADMIN.BUILDERS_DELETE(params.id)}`,
      { method: 'DELETE', headers: bbTeamHeaders(request) }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting builder:', error);
    return NextResponse.json({ apiErrors: ['Failed to delete builder'] }, { status: 500 });
  }
}

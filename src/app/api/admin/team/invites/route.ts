import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';
import { validateAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_TEAM.INVITES}`, {
      headers: bbTeamHeaders(request),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to fetch invites'] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_TEAM.INVITES}`, {
      method: 'POST',
      headers: bbTeamHeaders(request),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to create invite'] }, { status: 500 });
  }
}

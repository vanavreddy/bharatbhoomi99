import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbAdminHeaders } from '@/lib/api/bb-headers';
import { createAdminSessionToken, adminSessionSetCookie, validateAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  const authError = validateAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_TEAM.BOOTSTRAP}`, {
      method: 'POST',
      headers: bbAdminHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // On success, set admin session cookie with role + userId from backend response
    if (response.ok && data.model?.role && data.model?.teamMemberId) {
      const userId = typeof data.model.userId === 'number' ? data.model.userId : body.userId;
      const token = createAdminSessionToken(data.model.role, userId);
      const res = NextResponse.json(data, { status: response.status });
      res.headers.set('Set-Cookie', adminSessionSetCookie(token));
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Bootstrap failed'] }, { status: 500 });
  }
}

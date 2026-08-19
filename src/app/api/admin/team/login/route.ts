import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { createAdminSessionToken, adminSessionSetCookie } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_TEAM.LOGIN}`, {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // On success, set admin session cookie with role + userId
    if (response.ok && data.model?.role && data.model?.userId) {
      const token = createAdminSessionToken(data.model.role, data.model.userId);
      const res = NextResponse.json(data, { status: response.status });
      res.headers.set('Set-Cookie', adminSessionSetCookie(token));
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Login failed'] }, { status: 500 });
  }
}

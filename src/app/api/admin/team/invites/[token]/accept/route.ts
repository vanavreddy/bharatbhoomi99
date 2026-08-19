import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { createAdminSessionToken, adminSessionSetCookie } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

const TOKEN_PATTERN = /^[a-zA-Z0-9_-]{16,128}$/;

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!TOKEN_PATTERN.test(params.token)) {
    return NextResponse.json({ apiErrors: ['Invalid token format'] }, { status: 400 });
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_TEAM.INVITE_ACCEPT(params.token)}`,
      {
      cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    // Only set session cookie on successful backend response
    if (response.ok && data.model?.role && data.model?.userId) {
      const token = createAdminSessionToken(data.model.role, data.model.userId);
      const res = NextResponse.json(data, { status: response.status });
      res.headers.set('Set-Cookie', adminSessionSetCookie(token));
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to accept invite'] }, { status: 500 });
  }
}

/**
 * Admin Auth Route - POST /api/admin/auth (login), DELETE /api/admin/auth (logout)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  adminSessionSetCookie,
  adminSessionClearCookie,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminKey = process.env.BB_ADMIN_KEY;

    if (!adminKey) {
      console.error('BB_ADMIN_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    if (!password || password !== adminKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.headers.set('Set-Cookie', adminSessionSetCookie(token));
    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', adminSessionClearCookie());
  return response;
}

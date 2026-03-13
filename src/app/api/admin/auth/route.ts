/**
 * Admin Auth Route
 * POST  /api/admin/auth — validate static admin key (bootstrap only)
 * DELETE /api/admin/auth — clear admin session cookie (logout)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  adminSessionSetCookie,
  adminSessionClearCookie,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const password = (body as Record<string, unknown>)?.password;
    const adminKey = process.env.BB_ADMIN_KEY;

    if (!adminKey || typeof adminKey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    if (!password || typeof password !== 'string' || password !== adminKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Static key login creates a temporary super_admin session for bootstrap
    const token = createAdminSessionToken('super_admin', 0);
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.headers.set('Set-Cookie', adminSessionSetCookie(token));
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', adminSessionClearCookie());
  return response;
}

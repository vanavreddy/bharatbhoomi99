/**
 * Auth API Route - GET /api/auth/me
 *
 * Resolves the current user from the session cookie. This replaces reading the
 * user out of localStorage: the browser can no longer see who it is, which is
 * the point --- the identity is a signed token the client cannot forge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.ME}`, {
      cache: 'no-store',
      headers: bbHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error resolving session:', error);
    return NextResponse.json({ apiErrors: ['Failed to resolve session.'] }, { status: 500 });
  }
}

/**
 * Auth API Route - POST /api/auth/logout
 *
 * Proxies to the backend so the session cookie is cleared with the same
 * attributes it was set with; clearing it here instead would leave a cookie
 * the browser still sends.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders, relaySetCookie } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
      cache: 'no-store',
      method: 'POST',
      headers: bbHeaders(request),
    });

    const data = await response.json();
    const proxied = NextResponse.json(data, { status: response.status });
    relaySetCookie(response, proxied);
    return proxied;
  } catch (error) {
    console.error('Error proxying logout:', error);
    return NextResponse.json({ apiErrors: ['Failed to sign out.'] }, { status: 500 });
  }
}

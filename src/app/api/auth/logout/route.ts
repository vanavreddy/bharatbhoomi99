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

const SESSION_COOKIE = 'bb_session';

/**
 * Overwrites the session cookie with a value that cannot verify.
 *
 * The backend does send a correct deletion header
 * (`bb_session=; Expires=Thu, 01 Jan 1970 …`), but it never reaches the
 * browser: something between here and the Static Web Apps edge drops
 * already-expired Set-Cookie headers. Login relays through the identical
 * helper and arrives intact, so expiry is what triggers the loss — which means
 * `cookies.delete()` would be dropped for the same reason, since it also sends
 * an expired cookie.
 *
 * So the cookie is replaced rather than deleted. The value is not a JWT, so
 * verification fails on the very next request and the session is over
 * immediately. A short lifetime then lets the browser drop it on its own,
 * leaving nothing behind.
 */
function clearSession(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, 'logged-out', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10,
  });
}

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
    clearSession(proxied);
    return proxied;
  } catch (error) {
    console.error('Error proxying logout:', error);
    // Still end the session locally. A backend that cannot be reached is no
    // reason to leave the user holding a working cookie.
    const failed = NextResponse.json({ apiErrors: ['Failed to sign out.'] }, { status: 500 });
    clearSession(failed);
    return failed;
  }
}

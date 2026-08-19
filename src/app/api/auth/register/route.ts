/**
 * Auth API Route - POST /api/auth/register
 * Proxies BB registration to Azure backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { relaySetCookie } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const proxied = NextResponse.json(data, { status: response.status });

    // The backend issues the httpOnly session cookie. Without relaying it, the
    // cookie would stop at this server and the browser would never be signed in.
    relaySetCookie(response, proxied);
    return proxied;
  } catch (error) {
    console.error('Error proxying register:', error);
    return NextResponse.json(
      { apiErrors: ['Failed to create account. Please try again.'] },
      { status: 500 }
    );
  }
}

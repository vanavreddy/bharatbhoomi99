/**
 * POST /api/auth/forgot-password — request a password reset link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/bb/auth/forgot-password`, {
      method: 'POST',
      cache: 'no-store',
      headers: bbHeaders(request),
      // `.catch` so a malformed or absent body becomes a 400 from the
      // backend's validator rather than a 500 from this proxy.
      body: JSON.stringify(await request.json().catch(() => ({}))),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to send the reset link.', error);
    return NextResponse.json({ apiErrors: ['Failed to send the reset link.'] }, { status: 500 });
  }
}

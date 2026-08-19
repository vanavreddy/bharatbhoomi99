/**
 * POST /api/auth/send-verification — email the signed-in user a verification link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/bb/auth/send-verification`, {
      method: 'POST',
      cache: 'no-store',
      headers: bbHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to send the verification email.', error);
    return NextResponse.json({ apiErrors: ['Failed to send the verification email.'] }, { status: 500 });
  }
}

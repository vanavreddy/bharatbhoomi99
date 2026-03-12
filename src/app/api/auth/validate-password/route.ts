/**
 * Auth API Route - POST /api/auth/validate-password
 * Proxies password validation to Azure backend to avoid CORS
 * Accepts POST with { email, password } body, forwards to validatemember endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const payload = {
      userPhone: '',
      otp: 0,
      userName: email,
      password,
    };

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.NK_AUTH.VALIDATE_PASSWORD}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying validate-password:', error);
    return NextResponse.json(
      { apiErrors: ['Failed to sign in. Please try again.'] },
      { status: 500 }
    );
  }
}

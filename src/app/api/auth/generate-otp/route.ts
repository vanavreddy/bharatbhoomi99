/**
 * Auth API Route - POST /api/auth/generate-otp
 * Proxies OTP generation to Azure backend to avoid CORS
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}${ENDPOINTS.AUTH.GENERATE_OTP}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying generate-otp:', error);
    return NextResponse.json(
      { apiErrors: ['Failed to send OTP. Please try again.'] },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_USER.PROFILE}`, {
      cache: 'no-store',
      headers: bbHeaders(request),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to fetch profile'] }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_USER.PROFILE}`, {
      cache: 'no-store',
      method: 'PUT',
      headers: bbHeaders(request),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to update profile'] }, { status: 500 });
  }
}

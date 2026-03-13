import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbUserHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  const userId = request.headers.get('X-BB-User-Id');
  if (!userId) {
    return NextResponse.json({ apiErrors: ['User ID is required'] }, { status: 401 });
  }

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_USER.PROFILE}`, {
      headers: bbUserHeaders(userId),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to fetch profile'] }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const userId = request.headers.get('X-BB-User-Id');
  if (!userId) {
    return NextResponse.json({ apiErrors: ['User ID is required'] }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_USER.PROFILE}`, {
      method: 'PUT',
      headers: bbUserHeaders(userId),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to update profile'] }, { status: 500 });
  }
}

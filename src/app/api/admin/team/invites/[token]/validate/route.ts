import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

const TOKEN_PATTERN = /^[a-zA-Z0-9_-]{16,128}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!TOKEN_PATTERN.test(params.token)) {
    return NextResponse.json({ apiErrors: ['Invalid token format'] }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_TEAM.INVITE_VALIDATE(params.token)}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to validate invite'] }, { status: 500 });
  }
}

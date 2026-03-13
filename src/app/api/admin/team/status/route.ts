import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';
const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.BB_TEAM.STATUS}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ apiErrors: ['Failed to check team status'] }, { status: 500 });
  }
}

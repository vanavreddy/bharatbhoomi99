/**
 * Contact API Route - POST /api/contact
 * Proxies contact form submission to NammaKutira BB backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_CONTACT.SUBMIT}`,
      {
      cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying contact form:', error);
    return NextResponse.json(
      { apiErrors: ['Failed to submit contact form. Please try again.'] },
      { status: 500 }
    );
  }
}

/**
 * Favourites API Route - GET/POST/DELETE /api/favourites
 * Proxies favorite operations to NammaKutira BB backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbUserHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_FAVORITES.LIST}?userId=${userId}`,
      { headers: bbUserHeaders(userId) }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ apiErrors: ['Failed to fetch favorites'] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_FAVORITES.ADD}`,
      {
        method: 'POST',
        headers: bbUserHeaders(userId),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ apiErrors: ['Failed to add favorite'] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json({ apiErrors: ['User ID required'] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_FAVORITES.REMOVE}?userId=${userId}&propertyId=${propertyId}`,
      {
        method: 'DELETE',
        headers: bbUserHeaders(userId),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ apiErrors: ['Failed to remove favorite'] }, { status: 500 });
  }
}

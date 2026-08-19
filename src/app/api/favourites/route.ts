/**
 * Favourites API Route - GET/POST/DELETE /api/favourites
 * Proxies favorite operations to NammaKutira BB backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbHeaders } from '@/lib/api/bb-headers';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_FAVORITES.LIST}`,
      {
      cache: 'no-store', headers: bbHeaders(request) }
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
    const body = await request.json();

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_FAVORITES.ADD}`,
      {
      cache: 'no-store',
        method: 'POST',
        headers: bbHeaders(request),
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
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    if (!propertyId) {
      return NextResponse.json({ apiErrors: ['propertyId is required'] }, { status: 400 });
    }

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.BB_FAVORITES.REMOVE}?propertyId=${propertyId}`,
      {
      cache: 'no-store',
        method: 'DELETE',
        headers: bbHeaders(request),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ apiErrors: ['Failed to remove favorite'] }, { status: 500 });
  }
}

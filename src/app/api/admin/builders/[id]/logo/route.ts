/**
 * Builder Logo Upload API Route - POST /api/admin/builders/[id]/logo
 * Forwards logo file to backend for Azure Blob upload
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

// Authorisation lives in the backend, not here.
//
// This route used to gate on `bb_admin_session`, an HMAC cookie minted by
// POST /api/admin/auth from the raw admin key --- with userId 0, so it never
// identified anyone. The backend now verifies a signed session, re-reads the
// caller's AdminTeamMembers row on every request, and checks the specific
// permission the endpoint needs. Keeping a second, weaker gate here only
// blocked team members who logged in the normal way.

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const logo = formData.get('logo');
    if (!logo || !(logo instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Logo file is required' },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Forward to backend
    const backendFormData = new FormData();
    backendFormData.append('logo', logo);

    const backendUrl = `${API_CONFIG.BASE_URL}/api/bb/admin/builders/${params.id}/logo`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'X-BB-Admin-Key': API_CONFIG.ADMIN_KEY },
      body: backendFormData,
    });

    const data = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'SERVER_ERROR', message: data.apiErrors[0] },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { logoUrl: data.model?.logoUrl },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading builder logo:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

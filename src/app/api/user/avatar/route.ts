/**
 * User Avatar Upload API Route - POST /api/user/avatar
 * Forwards avatar file to backend for Azure Blob upload
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-BB-User-Id');
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User ID is required' },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const avatar = formData.get('avatar');
    if (!avatar || !(avatar instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Avatar file is required' },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Forward to backend
    const backendFormData = new FormData();
    backendFormData.append('avatar', avatar);

    const backendUrl = `${API_CONFIG.BASE_URL}/api/bb/user/avatar`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'X-BB-User-Id': userId },
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
        data: { avatarUrl: data.model?.avatarUrl },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading avatar:', error);
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

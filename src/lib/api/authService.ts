/**
 * Auth Service - BB self-contained authentication (email+password)
 * Replaces OTP-based NK auth with direct BB register/login
 */

import { ApiError } from './errors';
import type {
  BBAuthResponse,
  BBApiAuthResponse,
  User,
} from '@/types/auth.types';

/**
 * Create ApiError with consistent format
 */
function createAuthError(message: string, status: number = 400, retryable: boolean = false): ApiError {
  return new ApiError({
    code: status === 404 ? 'NOT_FOUND' : status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : 'VALIDATION_ERROR',
    message,
    status,
    retryable,
  });
}

/**
 * Map BBAuthResponse to simplified User
 */
export function mapBBUserToUser(bbUser: BBAuthResponse): User {
  return {
    id: bbUser.userId,
    email: bbUser.email,
    name: `${bbUser.firstName} ${bbUser.lastName}`.trim(),
    firstName: bbUser.firstName,
    lastName: bbUser.lastName,
    phone: bbUser.phone,
    role: bbUser.role === 'admin' ? 'admin' : 'user',
    isVerified: bbUser.isVerified,
    isAgent: false,
    agencyId: null,
    agencyName: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Legacy mapper kept for backward compatibility
 */
export function mapMobileUserToUser(mobileUser: { userId: number; userEmail?: string | null; firstName?: string | null; lastName?: string | null; userPhone?: string | null; isAgent?: boolean | null; isVerified?: boolean | null; agencyId?: number | null; agencyName?: string | null; accountCreatedOn?: string | null; userName?: string | null; middleName?: string | null }): User {
  const fullName = [mobileUser.firstName, mobileUser.middleName, mobileUser.lastName]
    .filter(Boolean)
    .join(' ') || mobileUser.userName || '';

  return {
    id: mobileUser.userId,
    email: mobileUser.userEmail ?? null,
    name: fullName,
    firstName: mobileUser.firstName ?? null,
    lastName: mobileUser.lastName ?? null,
    phone: mobileUser.userPhone ?? null,
    role: mobileUser.isAgent ? 'owner' : 'user',
    isVerified: mobileUser.isVerified ?? false,
    isAgent: mobileUser.isAgent ?? false,
    agencyId: mobileUser.agencyId ?? null,
    agencyName: mobileUser.agencyName ?? null,
    createdAt: mobileUser.accountCreatedOn ?? null,
  };
}

/**
 * Auth Service - BB self-contained
 */
export const authService = {
  /**
   * Register with email + password
   */
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<BBApiAuthResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
      }),
    });

    if (!response.ok) {
      throw ApiError.fromHttpStatus(response.status, 'Failed to create account. Please try again.');
    }

    const result: BBApiAuthResponse = await response.json();

    if (result.apiErrors && result.apiErrors.length > 0) {
      throw createAuthError(result.apiErrors[0] ?? 'Failed to create account.', 409);
    }

    return result;
  },

  /**
   * Login with email + password
   */
  async login(email: string, password: string): Promise<BBApiAuthResponse> {
    if (!email || !password) {
      throw createAuthError('Email and password are required.', 400);
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw createAuthError('Account not found. Please sign up.', 404);
      }
      throw ApiError.fromHttpStatus(response.status, 'Failed to sign in. Please try again.');
    }

    const data: BBApiAuthResponse = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      const errorMessage = (data.apiErrors[0] ?? '').toLowerCase();
      if (errorMessage.includes('not found')) {
        throw createAuthError('Account not found. Please sign up.', 404);
      }
      throw createAuthError(data.apiErrors[0] ?? 'An error occurred', 400);
    }

    return data;
  },

  /**
   * Validate admin key
   */
  async validateAdminKey(adminKey: string): Promise<{ authenticated: boolean }> {
    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey }),
    });

    const data = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      throw createAuthError(data.apiErrors[0] ?? 'Invalid admin key', 401);
    }

    return data.model || { authenticated: false };
  },
};

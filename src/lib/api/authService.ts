/**
 * Auth Service - Handles authentication API calls
 * Matches React Native app API structure
 */

import { ApiError } from './errors';
import type {
  GenerateOTPRequest,
  GenerateOTPResponse,
  ValidateOTPRequest,
  ValidateOTPResponse,
  ValidatePasswordResponse,
  CreateUserRequest,
  CreateUserResponse,
  MobileUser,
  User,
  AccountValidationResult,
} from '@/types/auth.types';

/**
 * Clean phone number - remove non-digit characters
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

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
 * Validate account status
 */
function validateAccountStatus(user: MobileUser | null): AccountValidationResult {
  if (!user) {
    return { isValid: true };
  }

  if (user.accountLocked) {
    return {
      isValid: false,
      error: 'Your account has been locked. Please contact support.',
      errorCode: 'LOCKED',
    };
  }

  if (user.accountExpired) {
    return {
      isValid: false,
      error: 'Your account has expired. Please contact support to renew.',
      errorCode: 'EXPIRED',
    };
  }

  if (user.accountActive === false) {
    return {
      isValid: false,
      error: 'Your account is inactive. Please contact support.',
      errorCode: 'INACTIVE',
    };
  }

  return { isValid: true };
}

/**
 * Map MobileUser to simplified User
 */
export function mapMobileUserToUser(mobileUser: MobileUser): User {
  const fullName = [mobileUser.firstName, mobileUser.middleName, mobileUser.lastName]
    .filter(Boolean)
    .join(' ') || mobileUser.userName;

  return {
    id: mobileUser.userId,
    email: mobileUser.userEmail,
    name: fullName,
    firstName: mobileUser.firstName,
    lastName: mobileUser.lastName,
    phone: mobileUser.userPhone,
    role: mobileUser.isAgent ? 'owner' : 'user',
    isVerified: mobileUser.isVerified ?? false,
    isAgent: mobileUser.isAgent ?? false,
    agencyId: mobileUser.agencyId ?? null,
    agencyName: mobileUser.agencyName ?? null,
    createdAt: mobileUser.accountCreatedOn,
  };
}

/**
 * Auth Service
 */
export const authService = {
  /**
   * Generate and send OTP to phone number
   */
  async generateOTP(phone: string): Promise<GenerateOTPResponse> {
    const cleanedPhone = cleanPhoneNumber(phone);

    if (cleanedPhone.length < 10) {
      throw createAuthError('Invalid phone number. Please enter a valid 10-digit number.', 400);
    }

    const payload: GenerateOTPRequest = {
      UserPhone: cleanedPhone,
      Otp: '',
    };

    const response = await fetch('/api/auth/generate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw ApiError.fromHttpStatus(response.status, 'Failed to send OTP. Please try again.');
    }

    const data: GenerateOTPResponse = await response.json();

    // Check for API errors
    if (data.apiErrors && data.apiErrors.length > 0) {
      throw createAuthError(data.apiErrors[0] ?? 'An error occurred', 400);
    }

    // Validate account status
    const accountValidation = validateAccountStatus(data.mobileUser);
    if (!accountValidation.isValid) {
      throw createAuthError(accountValidation.error ?? 'Account error', 403);
    }

    // Check if OTP was generated
    if (!data.model?.otpGenerated) {
      throw createAuthError('Failed to generate OTP. Please try again.', 400);
    }

    return data;
  },

  /**
   * Validate OTP
   */
  async validateOTP(phone: string, otp: string): Promise<ValidateOTPResponse> {
    const cleanedPhone = cleanPhoneNumber(phone);

    if (otp.length !== 4) {
      throw createAuthError('Please enter a valid 4-digit OTP.', 400);
    }

    const payload: ValidateOTPRequest = {
      UserPhone: cleanedPhone,
      Otp: otp,
    };

    const response = await fetch('/api/auth/validate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw ApiError.fromHttpStatus(response.status, 'Failed to verify OTP. Please try again.');
    }

    const data: ValidateOTPResponse = await response.json();

    // Check for API errors
    if (data.apiErrors && data.apiErrors.length > 0) {
      throw createAuthError(data.apiErrors[0] ?? 'An error occurred', 400);
    }

    // Check authorization
    if (!data.isAuthorized) {
      throw createAuthError('Invalid OTP. Please try again.', 401);
    }

    // userId === 0 indicates invalid OTP or new user needs registration
    if (data.mobileUser && data.mobileUser.userId === 0) {
      // This is a new user - return the response for further handling
      return data;
    }

    // Validate account status for existing users
    if (data.mobileUser) {
      const accountValidation = validateAccountStatus(data.mobileUser);
      if (!accountValidation.isValid) {
        throw createAuthError(accountValidation.error ?? 'Account error', 403);
      }
    }

    return data;
  },

  /**
   * Validate email and password
   */
  async validatePassword(email: string, password: string): Promise<ValidatePasswordResponse> {
    if (!email || !password) {
      throw createAuthError('Email and password are required.', 400);
    }

    const response = await fetch('/api/auth/validate-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw createAuthError('Account not found. Please sign up.', 404);
      }
      throw ApiError.fromHttpStatus(response.status, 'Failed to sign in. Please try again.');
    }

    const data: ValidatePasswordResponse = await response.json();

    // Check for API errors
    if (data.apiErrors && data.apiErrors.length > 0) {
      const errorMessage = (data.apiErrors[0] ?? '').toLowerCase();
      if (errorMessage.includes('not found')) {
        throw createAuthError('Account not found. Please sign up.', 404);
      }
      throw createAuthError(data.apiErrors[0] ?? 'An error occurred', 400);
    }

    // Check authorization
    if (!data.isAuthorized) {
      throw createAuthError('Invalid email or password.', 401);
    }

    // Validate account status
    const accountValidation = validateAccountStatus(data.mobileUser);
    if (!accountValidation.isValid) {
      throw createAuthError(accountValidation.error ?? 'Account error', 403);
    }

    return data;
  },

  /**
   * Create new user
   */
  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<CreateUserResponse> {
    const now = new Date().toISOString();
    const cleanedPhone = cleanPhoneNumber(data.phone);

    const payload: CreateUserRequest = {
      userPhone: cleanedPhone,
      userName: data.email,
      userPassword: data.password,
      FirstName: data.firstName,
      LastName: data.lastName,
      accountCreatedOn: now,
      accountAccessedOn: now,
      accountActive: true,
      accountLocked: false,
      accountExpired: false,
      accountClosedOn: '',
      userEmail: data.email,
    };

    const response = await fetch('/api/auth/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw ApiError.fromHttpStatus(response.status, 'Failed to create account. Please try again.');
    }

    const result: CreateUserResponse = await response.json();

    // Check for API errors (e.g. "Email address already exists")
    if (result.apiErrors && result.apiErrors.length > 0) {
      throw createAuthError(result.apiErrors[0] ?? 'Failed to create account.', 409);
    }

    return result;
  },
};

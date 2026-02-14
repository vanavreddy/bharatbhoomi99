/**
 * Authentication types - matching React Native app structure
 */

// User role types
export type UserRole = 'user' | 'owner' | 'admin';

// Mobile User - matches API response structure
export interface MobileUser {
  readonly userId: number;
  readonly userPhone: string | null;
  readonly userEmail: string | null;
  readonly userName: string | null;
  readonly userPassword: string | null;
  readonly firstName: string | null;
  readonly middleName: string | null;
  readonly lastName: string | null;
  readonly category: string | null;
  readonly identificationType: string | null;
  readonly accountCreatedOn: string | null;
  readonly accountAccessedOn: string | null;
  readonly accountActive: boolean | null;
  readonly accountLocked: boolean | null;
  readonly accountExpired: boolean | null;
  readonly accountClosedOn: string | null;
  readonly agencyId?: number | null;
  readonly agencyName?: string | null;
  readonly isAgent?: boolean | null;
  readonly isVerified?: boolean | null;
  readonly noOfPropertiesManaged?: number | null;
}

// OTP Model
export interface OTPModel {
  readonly userPhone: string;
  readonly otp: string | null;
  readonly otpGenerated: boolean;
}

// Simplified User for app use
export interface User {
  readonly id: number;
  readonly email: string | null;
  readonly name: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly phone: string | null;
  readonly avatar?: string;
  readonly role: UserRole;
  readonly isVerified: boolean;
  readonly isAgent: boolean;
  readonly agencyId: number | null;
  readonly agencyName: string | null;
  readonly createdAt: string | null;
}

// ============================================
// API Request Types
// ============================================

export interface GenerateOTPRequest {
  UserPhone: string;
  Otp: string;
}

export interface ValidateOTPRequest {
  UserPhone: string;
  Otp: string;
}

export interface CreateUserRequest {
  userPhone: string;
  userName: string;
  userPassword: string;
  FirstName: string;
  LastName: string;
  accountCreatedOn: string;
  accountAccessedOn: string;
  accountActive: boolean;
  accountLocked: boolean;
  accountExpired: boolean;
  accountClosedOn: string;
  userEmail: string;
}

// ============================================
// API Response Types
// ============================================

export interface GenerateOTPResponse {
  readonly model: OTPModel;
  readonly isAuthorized: boolean;
  readonly apiErrors: string[];
  readonly mobileUser: MobileUser;
}

export interface ValidateOTPResponse {
  readonly model: OTPModel | null;
  readonly isAuthorized: boolean;
  readonly apiErrors: string[];
  readonly mobileUser: MobileUser | null;
}

export interface ValidatePasswordResponse {
  readonly model: null;
  readonly isAuthorized: boolean;
  readonly apiErrors: string[];
  readonly mobileUser: MobileUser;
}

export interface CreateUserResponse {
  readonly model: MobileUser | null;
  readonly isAuthorized: boolean;
  readonly apiErrors: string[];
  readonly mobileUser: MobileUser | null;
}

// ============================================
// Auth State Types
// ============================================

export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isGuest: boolean;
  readonly lastLogin: string | null;
  readonly error: string | null;
}

export interface OTPState {
  readonly isGenerated: boolean;
  readonly isValidated: boolean;
  readonly phone: string | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly resendCount: number;
}

// ============================================
// Form Types
// ============================================

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface PhoneLoginData {
  phone: string;
  countryCode: string;
}

export interface OTPVerifyData {
  phone: string;
  otp: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// ============================================
// Auth Method Type
// ============================================

export type AuthMethod = 'phone' | 'email';

// ============================================
// Validation Types
// ============================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface AccountValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: 'LOCKED' | 'EXPIRED' | 'INACTIVE';
}


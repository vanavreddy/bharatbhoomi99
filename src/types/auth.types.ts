/**
 * Authentication and user types
 */

export type UserRole = 'user' | 'owner' | 'admin';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly phone?: string;
  readonly avatar?: string;
  readonly role: UserRole;
  readonly isVerified: boolean;
  readonly createdAt: string;
}

export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

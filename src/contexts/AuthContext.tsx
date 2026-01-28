'use client';

import {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { authService, mapMobileUserToUser } from '@/lib/api';
import type {
  User,
  AuthState,
  OTPState,
  GenerateOTPResponse,
  ValidateOTPResponse,
  ValidatePasswordResponse,
  CreateUserResponse,
  SignUpData,
} from '@/types/auth.types';

// Storage keys
const STORAGE_KEYS = {
  USER: 'bharatbhoomi_user',
  LAST_LOGIN: 'bharatbhoomi_last_login',
  IS_GUEST: 'bharatbhoomi_is_guest',
};

// Session timeout in hours
const SESSION_TIMEOUT_HOURS = 24;

// ============================================
// Auth State Reducer
// ============================================

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN'; payload: { user: User; isGuest?: boolean } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; lastLogin: string; isGuest: boolean } }
  | { type: 'CLEAR_ERROR' };

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading for session restore
  isGuest: false,
  lastLogin: null,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isGuest: action.payload.isGuest ?? false,
        lastLogin: new Date().toISOString(),
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...initialAuthState,
        isLoading: false,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isGuest: action.payload.isGuest,
        lastLogin: action.payload.lastLogin,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// ============================================
// OTP State Reducer
// ============================================

type OTPAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OTP_GENERATED'; payload: string }
  | { type: 'OTP_VALIDATED' }
  | { type: 'INCREMENT_RESEND' }
  | { type: 'RESET' };

const initialOTPState: OTPState = {
  isGenerated: false,
  isValidated: false,
  phone: null,
  error: null,
  isLoading: false,
  resendCount: 0,
};

function otpReducer(state: OTPState, action: OTPAction): OTPState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'OTP_GENERATED':
      return {
        ...state,
        isGenerated: true,
        phone: action.payload,
        isLoading: false,
        error: null,
      };
    case 'OTP_VALIDATED':
      return { ...state, isValidated: true, isLoading: false, error: null };
    case 'INCREMENT_RESEND':
      return { ...state, resendCount: state.resendCount + 1 };
    case 'RESET':
      return initialOTPState;
    default:
      return state;
  }
}

// ============================================
// Auth Context
// ============================================

interface AuthContextValue extends AuthState {
  // OTP-based authentication
  generateOTP: (phone: string) => Promise<GenerateOTPResponse>;
  validateOTP: (phone: string, otp: string) => Promise<ValidateOTPResponse>;

  // Email/Password authentication
  signInWithEmail: (email: string, password: string) => Promise<ValidatePasswordResponse>;

  // User management
  signUp: (data: SignUpData) => Promise<CreateUserResponse>;
  signOut: () => Promise<void>;
  loginAsGuest: () => void;

  // State
  otpState: OTPState;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// Auth Provider
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, dispatchAuth] = useReducer(authReducer, initialAuthState);
  const [otpState, dispatchOTP] = useReducer(otpReducer, initialOTPState);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedLastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
        const storedIsGuest = localStorage.getItem(STORAGE_KEYS.IS_GUEST);

        if (storedUser && storedLastLogin) {
          const lastLogin = new Date(storedLastLogin);
          const now = new Date();
          const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

          // Check session timeout
          if (hoursSinceLogin < SESSION_TIMEOUT_HOURS) {
            const user = JSON.parse(storedUser) as User;
            dispatchAuth({
              type: 'RESTORE_SESSION',
              payload: {
                user,
                lastLogin: storedLastLogin,
                isGuest: storedIsGuest === 'true',
              },
            });
            return;
          }
        }

        // Clear expired session
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
        localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
        dispatchAuth({ type: 'SET_LOADING', payload: false });
      } catch {
        dispatchAuth({ type: 'SET_LOADING', payload: false });
      }
    };

    restoreSession();
  }, []);

  // Save session to localStorage when auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authState.user));
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, authState.lastLogin || new Date().toISOString());
      localStorage.setItem(STORAGE_KEYS.IS_GUEST, String(authState.isGuest));
    }
  }, [authState.isAuthenticated, authState.user, authState.lastLogin, authState.isGuest]);

  // Generate OTP
  const generateOTP = useCallback(async (phone: string): Promise<GenerateOTPResponse> => {
    dispatchOTP({ type: 'SET_LOADING', payload: true });
    dispatchOTP({ type: 'SET_ERROR', payload: null });

    try {
      const response = await authService.generateOTP(phone);
      dispatchOTP({ type: 'OTP_GENERATED', payload: phone });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      dispatchOTP({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, []);

  // Validate OTP
  const validateOTP = useCallback(async (phone: string, otp: string): Promise<ValidateOTPResponse> => {
    dispatchOTP({ type: 'SET_LOADING', payload: true });
    dispatchOTP({ type: 'SET_ERROR', payload: null });
    dispatchAuth({ type: 'SET_ERROR', payload: null });

    try {
      const response = await authService.validateOTP(phone, otp);
      dispatchOTP({ type: 'OTP_VALIDATED' });

      // If user exists, log them in
      if (response.mobileUser && response.mobileUser.userId > 0) {
        const user = mapMobileUserToUser(response.mobileUser);
        dispatchAuth({ type: 'LOGIN', payload: { user } });
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid OTP';
      dispatchOTP({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, []);

  // Sign in with email
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<ValidatePasswordResponse> => {
    dispatchAuth({ type: 'SET_LOADING', payload: true });
    dispatchAuth({ type: 'SET_ERROR', payload: null });

    try {
      const response = await authService.validatePassword(email, password);

      if (response.mobileUser) {
        const user = mapMobileUserToUser(response.mobileUser);
        dispatchAuth({ type: 'LOGIN', payload: { user } });
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      dispatchAuth({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, []);

  // Sign up
  const signUp = useCallback(async (data: SignUpData): Promise<CreateUserResponse> => {
    dispatchAuth({ type: 'SET_LOADING', payload: true });
    dispatchAuth({ type: 'SET_ERROR', payload: null });

    try {
      const response = await authService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Auto-login after successful signup
      const user: User = {
        id: response.userId,
        email: response.userEmail,
        name: `${response.firstName} ${response.lastName}`.trim(),
        firstName: response.firstName,
        lastName: response.lastName,
        phone: response.userPhone,
        role: 'user',
        isVerified: false,
        isAgent: false,
        agencyId: null,
        agencyName: null,
        createdAt: response.accountCreatedOn,
      };

      dispatchAuth({ type: 'LOGIN', payload: { user } });
      dispatchOTP({ type: 'RESET' });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      dispatchAuth({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
    localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
    dispatchAuth({ type: 'LOGOUT' });
    dispatchOTP({ type: 'RESET' });
  }, []);

  // Login as guest
  const loginAsGuest = useCallback(() => {
    const guestUser: User = {
      id: 0,
      email: null,
      name: 'Guest',
      firstName: 'Guest',
      lastName: null,
      phone: null,
      role: 'user',
      isVerified: false,
      isAgent: false,
      agencyId: null,
      agencyName: null,
      createdAt: new Date().toISOString(),
    };
    dispatchAuth({ type: 'LOGIN', payload: { user: guestUser, isGuest: true } });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatchAuth({ type: 'CLEAR_ERROR' });
    dispatchOTP({ type: 'SET_ERROR', payload: null });
  }, []);

  const value: AuthContextValue = {
    ...authState,
    otpState,
    generateOTP,
    validateOTP,
    signInWithEmail,
    signUp,
    signOut,
    loginAsGuest,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// useAuth Hook
// ============================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { authService, mapBBUserToUser } from '@/lib/api';
import type {
  User,
  AuthState,
  BBApiAuthResponse,
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
      return { ...state, error: action.payload };
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
// Auth Context
// ============================================

interface AuthContextValue extends AuthState {
  // Email/Password authentication (BB self-contained)
  signInWithEmail: (email: string, password: string) => Promise<BBApiAuthResponse>;

  // User management
  signUp: (data: SignUpData) => Promise<BBApiAuthResponse>;
  signOut: () => Promise<void>;
  loginAsGuest: () => void;

  // State
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

  // Sign in with email (BB self-contained)
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<BBApiAuthResponse> => {
    dispatchAuth({ type: 'SET_LOADING', payload: true });
    dispatchAuth({ type: 'SET_ERROR', payload: null });

    try {
      const response = await authService.login(email, password);

      if (response.model) {
        const user = mapBBUserToUser(response.model);
        dispatchAuth({ type: 'LOGIN', payload: { user } });
      } else {
        dispatchAuth({ type: 'SET_LOADING', payload: false });
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      dispatchAuth({ type: 'SET_ERROR', payload: message });
      dispatchAuth({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  // Sign up (BB self-contained)
  const signUp = useCallback(async (data: SignUpData): Promise<BBApiAuthResponse> => {
    dispatchAuth({ type: 'SET_LOADING', payload: true });
    dispatchAuth({ type: 'SET_ERROR', payload: null });

    try {
      const response = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });

      // Auto-login after successful signup
      if (response.model) {
        const user = mapBBUserToUser(response.model);
        dispatchAuth({ type: 'LOGIN', payload: { user } });
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      dispatchAuth({ type: 'SET_ERROR', payload: message });
      dispatchAuth({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
    localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
    // Clear admin session cookie
    fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});
    dispatchAuth({ type: 'LOGOUT' });
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
  }, []);

  const value: AuthContextValue = {
    ...authState,
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

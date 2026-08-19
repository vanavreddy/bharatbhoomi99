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

  /**
   * Restore the session from the server, not from localStorage.
   *
   * The httpOnly session cookie is the only thing that authenticates a
   * request, and JavaScript cannot read it --- so the client asks the server
   * who it is. localStorage is still written below, but purely as a display
   * cache: a stale or hand-edited entry buys nothing, because every API call
   * is authorised by the cookie's signature rather than by this state.
   */
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (cancelled) return;

        if (res.ok && data?.model) {
          const model = data.model;

          /**
           * Admin status comes from team membership, not from `BBUsers.Role`.
           *
           * Every account --- including the super admin --- has Role 'user' on
           * the user row; being an admin is a row in AdminTeamMembers. Reading
           * only `model.role` here makes `isAdmin` false for everybody and
           * bounces the admin panel back to its login page in a loop.
           */
          const teamRole: string | null = model.teamRole ?? null;

          const user: User = {
            id: Number(model.userId),
            email: model.email ?? null,
            name: [model.firstName, model.lastName].filter(Boolean).join(' ') || null,
            firstName: model.firstName ?? null,
            lastName: model.lastName ?? null,
            phone: model.phone ?? null,
            avatar: model.avatarUrl ?? undefined,
            role: teamRole ? 'admin' : model.role,
            isVerified: Boolean(model.isVerified),
            // BB has no agency concept; these exist on the shared User type
            // because it is also used by the NammaKutira side.
            isAgent: false,
            agencyId: null,
            agencyName: null,
            createdAt: null,
            // Consumed by the admin layout to filter sidebar links by
            // permission. Server-derived, so a hand-edited localStorage entry
            // is overwritten on the next page load.
            ...(teamRole ? { teamRole, teamMemberId: model.teamMemberId ?? null } : {}),
          } as User;

          dispatchAuth({
            type: 'RESTORE_SESSION',
            payload: { user, lastLogin: new Date().toISOString(), isGuest: false },
          });
          return;
        }

        // No valid session: drop any cached display data so the UI does not
        // show a signed-in header for a session the server has forgotten.
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
        localStorage.removeItem(STORAGE_KEYS.IS_GUEST);
        dispatchAuth({ type: 'SET_LOADING', payload: false });
      } catch {
        if (!cancelled) dispatchAuth({ type: 'SET_LOADING', payload: false });
      }
    };

    void restoreSession();
    return () => {
      cancelled = true;
    };
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

    // Clearing local state is not signing out: the session cookie is httpOnly,
    // so only the server can revoke it. Awaited so the UI does not navigate
    // away while the browser still holds a valid session.
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    await fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});
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

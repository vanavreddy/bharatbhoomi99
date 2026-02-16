'use client';

import {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { Builder } from '@/types/builder.types';
import { BANGALORE_BUILDERS } from '@/lib/constants/builders';

const STORAGE_KEY = 'bharatbhoomi_builders';
const STORAGE_VERSION_KEY = 'bharatbhoomi_builders_version';
const CURRENT_VERSION = 2; // Bump to reset all visitors to new defaults

// ============================================
// Builder State
// ============================================

interface BuilderState {
  builders: Builder[];
  isLoaded: boolean;
}

type BuilderAction =
  | { type: 'INIT'; payload: Builder[] }
  | { type: 'ADD'; payload: Builder }
  | { type: 'UPDATE'; payload: Builder }
  | { type: 'DELETE'; payload: string }
  | { type: 'TOGGLE_ACTIVE'; payload: string };

const initialState: BuilderState = {
  builders: [],
  isLoaded: false,
};

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'INIT':
      return { builders: action.payload, isLoaded: true };
    case 'ADD':
      return { ...state, builders: [...state.builders, action.payload] };
    case 'UPDATE':
      return {
        ...state,
        builders: state.builders.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case 'DELETE':
      return {
        ...state,
        builders: state.builders.filter((b) => b.id !== action.payload),
      };
    case 'TOGGLE_ACTIVE':
      return {
        ...state,
        builders: state.builders.map((b) =>
          b.id === action.payload ? { ...b, isActive: !b.isActive } : b
        ),
      };
    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface BuilderContextValue {
  allBuilders: Builder[];
  activeBuilders: Builder[];
  isLoaded: boolean;
  addBuilder: (builder: Builder) => void;
  updateBuilder: (builder: Builder) => void;
  deleteBuilder: (id: string) => void;
  toggleBuilderActive: (id: string) => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

// ============================================
// Provider
// ============================================

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  // Initialize from localStorage, merging with defaults
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      const version = storedVersion ? parseInt(storedVersion, 10) : 0;

      // If version mismatch, reset to new defaults (all builders inactive)
      if (version < CURRENT_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
        dispatch({ type: 'INIT', payload: BANGALORE_BUILDERS });
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedBuilders: Builder[] = JSON.parse(stored);
        // Merge: use stored data for existing builders, add any new defaults
        const storedIds = new Set(storedBuilders.map((b) => b.id));
        const newDefaults = BANGALORE_BUILDERS.filter((b) => !storedIds.has(b.id));
        dispatch({ type: 'INIT', payload: [...storedBuilders, ...newDefaults] });
      } else {
        dispatch({ type: 'INIT', payload: BANGALORE_BUILDERS });
      }
      localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
    } catch {
      dispatch({ type: 'INIT', payload: BANGALORE_BUILDERS });
    }
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.builders));
    }
  }, [state.builders, state.isLoaded]);

  const addBuilder = useCallback((builder: Builder) => {
    dispatch({ type: 'ADD', payload: builder });
  }, []);

  const updateBuilder = useCallback((builder: Builder) => {
    dispatch({ type: 'UPDATE', payload: builder });
  }, []);

  const deleteBuilder = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const toggleBuilderActive = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_ACTIVE', payload: id });
  }, []);

  const value: BuilderContextValue = {
    allBuilders: state.builders,
    activeBuilders: state.builders.filter((b) => b.isActive),
    isLoaded: state.isLoaded,
    addBuilder,
    updateBuilder,
    deleteBuilder,
    toggleBuilderActive,
  };

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useBuilders(): BuilderContextValue {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilders must be used within a BuilderProvider');
  }
  return context;
}

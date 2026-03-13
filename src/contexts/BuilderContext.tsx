'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Builder } from '@/types/builder.types';
import { builderService } from '@/lib/api/services/builder.service';

// ============================================
// Context
// ============================================

interface BuilderContextValue {
  allBuilders: Builder[];
  activeBuilders: Builder[];
  isLoaded: boolean;
  error: string | null;
  refetch: () => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

// ============================================
// Provider
// ============================================

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuilders = useCallback(async () => {
    setError(null);
    try {
      const data = await builderService.getActiveBuilders();
      setBuilders(data);
    } catch {
      setError('Failed to load builders');
      setBuilders([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchBuilders();
  }, [fetchBuilders]);

  const value: BuilderContextValue = {
    allBuilders: builders,
    activeBuilders: builders.filter((b) => b.isActive),
    isLoaded,
    error,
    refetch: fetchBuilders,
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

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
  refetch: () => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

// ============================================
// Provider
// ============================================

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchBuilders = useCallback(async () => {
    try {
      const data = await builderService.getActiveBuilders();
      setBuilders(data);
    } catch {
      // Silent fail — will show empty state
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

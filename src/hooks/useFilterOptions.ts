/**
 * useFilterOptions Hook - Fetch available filter options
 * Caches results to avoid unnecessary API calls - no memory leaks
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FilterOptions } from '@/lib/api';

interface UseFilterOptionsResult {
  filterOptions: FilterOptions | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache (module-level)
let cachedOptions: FilterOptions | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFilterOptions(): UseFilterOptionsResult {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(cachedOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track mounted state
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFilterOptions = useCallback(async (forceRefresh = false) => {
    // Return cached data if still valid
    const now = Date.now();
    if (!forceRefresh && cachedOptions && now - cacheTimestamp < CACHE_DURATION) {
      if (mountedRef.current) {
        setFilterOptions(cachedOptions);
      }
      return;
    }

    // Don't fetch if not mounted
    if (!mountedRef.current) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties/filters', {
        signal: currentController.signal,
      });

      if (!mountedRef.current) return;

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch filter options');
      }

      // Update cache
      cachedOptions = data.data;
      cacheTimestamp = Date.now();

      setFilterOptions(data.data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
      // Clear controller reference
      if (abortControllerRef.current === currentController) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchFilterOptions();

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [fetchFilterOptions]);

  const refetch = useCallback(() => {
    fetchFilterOptions(true);
  }, [fetchFilterOptions]);

  return {
    filterOptions,
    isLoading,
    error,
    refetch,
  };
}

// Export cache clearing function for testing/logout scenarios
export function clearFilterOptionsCache(): void {
  cachedOptions = null;
  cacheTimestamp = 0;
}

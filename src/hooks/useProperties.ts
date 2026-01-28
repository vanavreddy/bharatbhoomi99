/**
 * useProperties Hook - Fetches property list with proper cleanup
 * Prevents memory leaks with AbortController and cleanup on unmount
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Property, PaginationMeta } from '@/types/property.types';

interface UsePropertiesOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UsePropertiesResult {
  properties: Property[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesResult {
  const { page = 1, limit = 10, enabled = true } = options;

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track mounted state - prevents state updates after unmount
  const mountedRef = useRef(true);
  // Store abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProperties = useCallback(async () => {
    // Don't fetch if not mounted
    if (!mountedRef.current) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await fetch(`/api/properties?${params}`, {
        signal: currentController.signal,
      });

      // Check if still mounted before updating state
      if (!mountedRef.current) return;

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch properties');
      }

      setProperties(data.data);
      setPagination(data.pagination);
    } catch (err) {
      // Ignore abort errors
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
      // Clear controller reference if it's the same one
      if (abortControllerRef.current === currentController) {
        abortControllerRef.current = null;
      }
    }
  }, [page, limit]);

  useEffect(() => {
    // Reset mounted state on mount (handles React 18 Strict Mode)
    mountedRef.current = true;

    if (enabled) {
      fetchProperties();
    }

    // Cleanup function - runs on unmount or before re-running effect
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [fetchProperties, enabled]);

  return {
    properties,
    pagination,
    isLoading,
    error,
    refetch: fetchProperties,
  };
}

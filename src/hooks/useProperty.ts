/**
 * useProperty Hook - Fetch single property by ID
 * Proper cleanup with AbortController - no memory leaks
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Property } from '@/types/property.types';

interface UsePropertyOptions {
  enabled?: boolean;
}

interface UsePropertyResult {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProperty(
  id: string | null | undefined,
  options: UsePropertyOptions = {}
): UsePropertyResult {
  const { enabled = true } = options;

  // Start in loading state when we know a fetch will happen immediately
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(!!id && enabled);
  const [error, setError] = useState<string | null>(null);

  // Track mounted state
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) {
      setProperty(null);
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
      const response = await fetch(`/api/properties/${id}`, {
        signal: currentController.signal,
      });

      if (!mountedRef.current) return;

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch property');
      }

      setProperty(data.data);
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
  }, [id]);

  useEffect(() => {
    // Reset mounted state on mount
    mountedRef.current = true;

    if (enabled && id) {
      fetchProperty();
    }

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [fetchProperty, enabled, id]);

  return {
    property,
    isLoading,
    error,
    refetch: fetchProperty,
  };
}

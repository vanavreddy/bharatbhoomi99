/**
 * useCreateProperty Hook - Handle property creation
 * Proper cleanup and state management with no memory leaks
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { CreatePropertyInput } from '@/lib/api';

interface CreatePropertyResult {
  success: boolean;
  propertyId?: number;
  message: string;
}

interface UseCreatePropertyResult {
  createProperty: (input: CreatePropertyInput) => Promise<CreatePropertyResult>;
  isCreating: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  reset: () => void;
}

export function useCreateProperty(): UseCreatePropertyResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  // Track mounted state to prevent state updates after unmount
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // Cancel any pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const createProperty = useCallback(
    async (input: CreatePropertyInput): Promise<CreatePropertyResult> => {
      // Don't start if already unmounted
      if (!mountedRef.current) {
        return { success: false, message: 'Component unmounted' };
      }

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const currentController = abortControllerRef.current;

      setIsCreating(true);
      setError(null);
      setValidationErrors(null);

      try {
        const response = await fetch('/api/properties/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
          signal: currentController.signal,
        });

        // Check if still mounted after async operation
        if (!mountedRef.current) {
          return { success: false, message: 'Component unmounted' };
        }

        const data = await response.json();

        if (!data.success) {
          if (data.error?.code === 'VALIDATION_ERROR' && data.error?.details) {
            if (mountedRef.current) {
              setValidationErrors(data.error.details);
            }
          }
          throw new Error(data.error?.message || 'Failed to create property');
        }

        return {
          success: true,
          propertyId: data.data?.propertyId,
          message: data.data?.message || 'Property created successfully',
        };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { success: false, message: 'Request was cancelled' };
        }

        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';

        if (mountedRef.current) {
          setError(errorMessage);
        }

        return { success: false, message: errorMessage };
      } finally {
        if (mountedRef.current) {
          setIsCreating(false);
        }
        // Clear the controller reference if it's the same one we started with
        if (abortControllerRef.current === currentController) {
          abortControllerRef.current = null;
        }
      }
    },
    []
  );

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
      setValidationErrors(null);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    createProperty,
    isCreating,
    error,
    validationErrors,
    reset,
  };
}

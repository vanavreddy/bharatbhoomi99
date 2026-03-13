/**
 * usePropertySearch Hook - Search properties with filters
 * Implements debouncing and proper cleanup - no memory leaks
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Property, PaginationMeta, PropertyFilters } from '@/types/property.types';

interface UsePropertySearchOptions {
  page?: number;
  limit?: number;
  query?: string;
  filters?: PropertyFilters;
  debounceMs?: number;
  enabled?: boolean;
}

interface UsePropertySearchResult {
  properties: Property[];
  pagination: PaginationMeta | null;
  filters: PropertyFilters;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  search: (query: string) => void;
  setFilters: (filters: PropertyFilters) => void;
  setPage: (page: number) => void;
  loadMore: () => void;
  hasMore: boolean;
  refetch: () => void;
}

export function usePropertySearch(
  options: UsePropertySearchOptions = {}
): UsePropertySearchResult {
  const {
    page: initialPage = 1,
    limit = 10,
    query: initialQuery = '',
    filters: initialFilters = {},
    debounceMs = 300,
    enabled = true,
  } = options;

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentFilters, setCurrentFilters] = useState<PropertyFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup and tracking
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // Cancel pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setDebouncedQuery(searchQuery);
        setCurrentPage(1); // Reset to first page on new search
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [searchQuery, debounceMs]);

  const fetchProperties = useCallback(
    async (isLoadMore = false) => {
      // Don't fetch if not mounted
      if (!mountedRef.current) return;

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const currentController = abortControllerRef.current;

      if (isLoadMore) {
        setIsLoading(true);
      } else {
        setIsSearching(true);
      }
      setError(null);

      try {
        const response = await fetch('/api/properties/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: currentPage,
            limit,
            query: debouncedQuery || undefined,
            filters: Object.keys(currentFilters).length > 0 ? currentFilters : undefined,
          }),
          signal: currentController.signal,
        });

        if (!mountedRef.current) return;

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to search properties');
        }

        if (isLoadMore) {
          // Append to existing properties, avoiding duplicates
          setProperties((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProperties = data.data.filter(
              (p: Property) => !existingIds.has(p.id)
            );
            return [...prev, ...newProperties];
          });
        } else {
          setProperties(data.data);
        }

        setPagination(data.pagination);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        // Don't update loading state for aborted requests — another fetch is taking over
        if (mountedRef.current && !currentController.signal.aborted) {
          setIsLoading(false);
          setIsSearching(false);
        }
        // Clear controller reference
        if (abortControllerRef.current === currentController) {
          abortControllerRef.current = null;
        }
      }
    },
    [currentPage, limit, debouncedQuery, currentFilters]
  );

  // Fetch on dependencies change
  useEffect(() => {
    if (enabled) {
      fetchProperties(currentPage > 1);
    }
  }, [fetchProperties, enabled, currentPage, debouncedQuery, currentFilters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const setFilters = useCallback((filters: PropertyFilters) => {
    setCurrentFilters(filters);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    // When changing page directly (pagination), don't append - replace
    setProperties([]);
  }, []);

  const loadMore = useCallback(() => {
    if (pagination?.hasNext && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination?.hasNext, isLoading]);

  const refetch = useCallback(() => {
    setCurrentPage(1);
    fetchProperties(false);
  }, [fetchProperties]);

  const hasMore = useMemo(() => pagination?.hasNext ?? false, [pagination]);

  return {
    properties,
    pagination,
    filters: currentFilters,
    isLoading,
    isSearching,
    error,
    search,
    setFilters,
    setPage,
    loadMore,
    hasMore,
    refetch,
  };
}

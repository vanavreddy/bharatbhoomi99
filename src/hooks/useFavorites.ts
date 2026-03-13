'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { favoritesService } from '@/lib/api/services/favorites.service';
import { useAuth, useToast } from '@/contexts';
import type { Favorite } from '@/types';

export function useFavorites() {
  const { user, isAuthenticated, isGuest } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const { showToast } = useToast();
  const isLoggedIn = isAuthenticated && !isGuest && user;

  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await favoritesService.getFavorites(user.id);
      if (mountedRef.current) {
        setFavorites(data);
        setFavoriteIds(new Set(data.map((f) => f.propertyId)));
      }
    } catch {
      if (mountedRef.current) setError('Could not load favorites');
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    mountedRef.current = true;
    fetchFavorites();
    return () => { mountedRef.current = false; };
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (propertyId: number) => {
    if (!isLoggedIn) return;
    // Optimistic update
    setFavoriteIds((prev) => new Set(prev).add(propertyId));
    try {
      await favoritesService.addFavorite(user.id, propertyId);
      showToast('Added to favorites');
      fetchFavorites(); // Sync with server
    } catch {
      showToast('Failed to add favorite', 'error');
      // Rollback
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    }
  }, [isLoggedIn, user, fetchFavorites]);

  const removeFavorite = useCallback(async (propertyId: number) => {
    if (!isLoggedIn) return;
    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(propertyId);
      return next;
    });
    try {
      await favoritesService.removeFavorite(user.id, propertyId);
      showToast('Removed from favorites');
      fetchFavorites(); // Sync with server
    } catch {
      showToast('Failed to remove favorite', 'error');
      // Rollback
      setFavoriteIds((prev) => new Set(prev).add(propertyId));
    }
  }, [isLoggedIn, user, fetchFavorites]);

  const isFavorited = useCallback((propertyId: number) => {
    return favoriteIds.has(propertyId);
  }, [favoriteIds]);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorited,
    refetch: fetchFavorites,
  };
}

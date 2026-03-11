/**
 * Favorites Service — manages user's favorite properties via internal Next.js proxy
 * Called from client-side hooks, so uses relative URLs to hit /api/favourites proxy
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse, ExternalBBFavorite, BBAddFavoriteRequest } from '../bb-types';
import type { Favorite } from '@/types';

export interface IFavoritesService {
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(userId: number, propertyId: number): Promise<void>;
  removeFavorite(userId: number, propertyId: number): Promise<void>;
}

class FavoritesService implements IFavoritesService {
  async getFavorites(userId: number): Promise<Favorite[]> {
    const res = await fetch('/api/favourites', {
      headers: {
        'Content-Type': 'application/json',
        'X-BB-User-Id': String(userId),
      },
    });
    const data: BBApiResponse<ExternalBBFavorite[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async addFavorite(userId: number, propertyId: number): Promise<void> {
    const body: BBAddFavoriteRequest = { userId, propertyId };
    const res = await fetch('/api/favourites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BB-User-Id': String(userId),
      },
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<BBAddFavoriteRequest> = await res.json();
    unwrapBBResponse(data);
  }

  async removeFavorite(userId: number, propertyId: number): Promise<void> {
    const res = await fetch(`/api/favourites?propertyId=${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-BB-User-Id': String(userId),
      },
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }
}

export const favoritesService = new FavoritesService();

'use client';

import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { Heart, MapPin, Trash2, Building, LogIn } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';

export default function FavoritesPage() {
  const { isAuthenticated, isGuest } = useAuth();
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const isLoggedIn = isAuthenticated && !isGuest;

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <LogIn className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view favorites</h1>
          <p className="text-gray-600 mb-6">Save properties you love and access them anytime.</p>
          <Link
            href={ROUTES.SIGN_IN}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            Properties you&apos;ve saved ({favorites.length})
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Browse properties and tap the heart icon to save them here.</p>
            <Link
              href={ROUTES.PROPERTIES}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <Card key={fav.favoriteId} padding="none" className="overflow-hidden hover:shadow-md transition-shadow">
                <Link href={ROUTES.PROPERTY_DETAIL(String(fav.propertyId))} className="block p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4 text-brand-primary flex-shrink-0" />
                        <h3 className="font-medium text-gray-900 truncate">
                          {fav.propertyName || `Property #${fav.propertyId}`}
                        </h3>
                      </div>
                      {fav.city && (
                        <p className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          {fav.city}
                        </p>
                      )}
                      {fav.rent != null && fav.rent > 0 && (
                        <p className="text-lg font-bold text-brand-primary">
                          {formatPrice(fav.rent)}
                        </p>
                      )}
                      {fav.status && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded capitalize">
                          {fav.status}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFavorite(fav.propertyId);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

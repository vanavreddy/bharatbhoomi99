'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import {
  Building2, MapPin, Calendar, LogIn, Plus, ImageIcon,
} from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils/format';

interface MyProperty {
  bbPropertyId: number;
  propertyName: string;
  type: string;
  category: string | null;
  rent: number;
  city: string;
  status: string;
  rejectionReason: string | null;
  noOfImages: number;
  imageUrls: string[];
  createdAt: string;
}

export default function MyPropertiesPage() {
  const { user, isAuthenticated, isGuest, isLoading: authLoading } = useAuth();
  const isLoggedIn = isAuthenticated && !isGuest;

  const [properties, setProperties] = useState<MyProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyProperties = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/properties/my', {
        headers: {
          'X-BB-User-Id': String(user.id),
        },
      });
      const data = await res.json();
      if (data.success) {
        setProperties(data.data || []);
      } else {
        setError(data.error?.message || 'Failed to load properties');
      }
    } catch {
      setError('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchMyProperties();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [isLoggedIn, user?.id, authLoading, fetchMyProperties]);

  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <Badge variant="success" size="sm">Live</Badge>;
      case 'rejected': return <Badge variant="error" size="sm">Rejected</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending Review</Badge>;
      default: return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <LogIn className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your properties</h1>
          <p className="text-gray-600 mb-6">Track the status of your property listings.</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              My Properties
            </h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${properties.length} listing${properties.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href={ROUTES.LIST_PROPERTY}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Sell Property
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No properties listed yet</h2>
            <p className="text-gray-500 mb-6">List your first property and start getting enquiries.</p>
            <Link
              href={ROUTES.LIST_PROPERTY}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
            >
              <Plus className="h-4 w-4" />
              Sell Your Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((prop) => (
              <Card key={prop.bbPropertyId} padding="none" className="overflow-hidden hover:shadow-md transition-shadow">
                <Link href={ROUTES.PROPERTY_DETAIL(String(prop.bbPropertyId))} className="block">
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-gray-100">
                    {prop.imageUrls && prop.imageUrls.length > 0 ? (
                      <img
                        src={prop.imageUrls[0]}
                        alt={prop.propertyName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {statusBadge(prop.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {prop.propertyName || 'Unnamed Property'}
                    </h3>

                    {prop.category && (
                      <p className="text-xs text-gray-500 capitalize mb-2">{prop.category}</p>
                    )}

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{prop.city}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-brand-primary">
                        {prop.rent > 0 ? `₹${formatPrice(prop.rent)}` : '-'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(prop.createdAt)}
                      </span>
                    </div>

                    {/* Rejection reason */}
                    {prop.status === 'rejected' && prop.rejectionReason && (
                      <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs text-red-600">
                          <span className="font-medium">Rejected:</span> {prop.rejectionReason}
                        </p>
                      </div>
                    )}
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

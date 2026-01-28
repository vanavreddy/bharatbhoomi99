import Link from 'next/link';
import { PropertyCard } from './PropertyCard';
import { ROUTES } from '@/lib/constants';
import type { Property } from '@/types';
import { Home, Search, Plus } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  emptyMessage?: string;
  variant?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
}

// Skeleton component for loading state
function PropertyCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="flex flex-col sm:flex-row">
          {/* Image skeleton */}
          <div className="w-full sm:w-72 h-48 sm:h-auto bg-gray-200 flex-shrink-0" />
          {/* Content skeleton */}
          <div className="flex-1 p-4">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-4 mt-4">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-gray-200" />
      {/* Content skeleton */}
      <div className="p-3 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-3 pt-2">
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={ROUTES.PROPERTIES}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-primary border border-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors"
        >
          <Home className="h-4 w-4" />
          View All Properties
        </Link>
        <Link
          href={ROUTES.LIST_PROPERTY}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          List Your Property
        </Link>
      </div>
    </div>
  );
}

export function PropertyGrid({
  properties,
  isLoading = false,
  emptyMessage = 'No properties match your search criteria. Try adjusting your filters or search terms.',
  variant = 'grid',
  columns = 3,
}: PropertyGridProps) {
  const gridClasses = `grid grid-cols-1 sm:grid-cols-2 ${
    columns === 4
      ? 'lg:grid-cols-3 xl:grid-cols-4'
      : columns === 2
      ? 'lg:grid-cols-2'
      : 'lg:grid-cols-3'
  } gap-4`;

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className={variant === 'list' ? 'space-y-4' : gridClasses}>
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  // Empty state
  if (properties.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  // List variant
  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {properties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            priority={index < 2}
            variant="list"
          />
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={gridClasses}>
      {properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          priority={index < 4}
          variant="grid"
        />
      ))}
    </div>
  );
}

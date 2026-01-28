import { PropertyCard } from './PropertyCard';
import { SkeletonCard } from '@/components/ui';
import type { Property } from '@/types';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function PropertyGrid({
  properties,
  isLoading = false,
  emptyMessage = 'No properties found',
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          priority={index < 3}
        />
      ))}
    </div>
  );
}

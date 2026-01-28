'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice, formatArea } from '@/lib/utils/format';
import { Badge, Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import type { Property } from '@/types';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Verified,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  className?: string;
  priority?: boolean;
}

export function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <Card
      padding="none"
      className={cn('overflow-hidden group', className)}
      interactive
    >
      <Link
        href={ROUTES.PROPERTY_DETAIL(property.id)}
        className="block"
        aria-label={`View details for ${property.title}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Square className="h-12 w-12" />
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {property.isFeatured && (
              <Badge variant="accent" size="sm">
                Featured
              </Badge>
            )}
            <Badge
              variant={property.listingType === 'rent' ? 'primary' : 'secondary'}
              size="sm"
            >
              For {property.listingType === 'rent' ? 'Rent' : property.listingType === 'sale' ? 'Sale' : 'Lease'}
            </Badge>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            aria-label="Add to favorites"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Add to favorites
            }}
          >
            <Heart className="h-5 w-5 text-gray-600 hover:text-brand-accent" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
              {property.listingType === 'rent' && (
                <span className="text-sm font-normal text-gray-500">
                  /{property.priceUnit === 'month' ? 'mo' : 'yr'}
                </span>
              )}
            </span>
            {property.owner.isVerified && (
              <span className="flex items-center gap-1 text-xs text-semantic-success">
                <Verified className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-brand-primary transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {property.address.locality}, {property.address.city}
            </span>
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
            </span>
            <span className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              {formatArea(property.area)}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

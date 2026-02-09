'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatPrice, formatArea } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/contexts';
import { trackPropertyView } from '@/lib/services/statsService';
import { LoginPromptModal } from '@/components/modals/LoginPromptModal';
import type { Property } from '@/types';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  className?: string;
  priority?: boolean;
  variant?: 'grid' | 'list';
}

export function PropertyCard({ property, className, priority = false, variant = 'grid' }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];
  const { user, isAuthenticated, isGuest } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // Track the view
    trackPropertyView(property.id, user ? { id: user.id, phone: user.phone, name: user.name } : undefined);

    // If not authenticated, intercept and show login modal
    if (!isAuthenticated || isGuest) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const handleGuestContinue = () => {
    router.push(ROUTES.PROPERTY_DETAIL(property.id));
  };

  if (variant === 'list') {
    return (
      <>
        <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow', className)}>
          <Link
            href={ROUTES.PROPERTY_DETAIL(property.id)}
            className="flex flex-col sm:flex-row"
            onClick={handleClick}
          >
            {/* Image */}
            <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 288px"
                  priority={priority}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <Maximize className="h-8 w-8 text-gray-300" />
                </div>
              )}
              {property.isFeatured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded">
                  Featured
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </span>
                    {property.listingType === 'rent' && (
                      <span className="text-sm text-gray-500">/month</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-medium text-gray-900 line-clamp-1 mb-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{property.address.locality}, {property.address.city}</span>
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-gray-400" />
                        {property.bedrooms} BHK
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-gray-400" />
                      {property.bathrooms} Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-4 w-4 text-gray-400" />
                      {formatArea(property.area)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Save"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); }}
                    className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Bottom info */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="capitalize">{property.furnishing}</span>
                  <span>•</span>
                  <span className="capitalize">{property.type}</span>
                </div>
                {property.owner.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
        <LoginPromptModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onGuestContinue={handleGuestContinue}
        />
      </>
    );
  }

  return (
    <>
      <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group', className)}>
        <Link
          href={ROUTES.PROPERTY_DETAIL(property.id)}
          className="block"
          onClick={handleClick}
        >
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={priority}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Maximize className="h-8 w-8 text-gray-300" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1.5">
              {property.isFeatured && (
                <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded">
                  Featured
                </span>
              )}
              <span className="px-2 py-0.5 bg-brand-primary text-white text-xs font-medium rounded">
                {property.listingType === 'rent' ? 'Rent' : 'Sale'}
              </span>
            </div>

            {/* Favorite */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
              aria-label="Save"
            >
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
            </button>

            {/* Image count */}
            {property.images.length > 1 && (
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                1/{property.images.length}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(property.price)}
              </span>
              {property.listingType === 'rent' && (
                <span className="text-xs text-gray-500">/month</span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1 group-hover:text-brand-primary transition-colors">
              {property.title}
            </h3>

            {/* Location */}
            <p className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">{property.address.locality}, {property.address.city}</span>
            </p>

            {/* Features */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5 text-gray-400" />
                  {property.bedrooms}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-gray-400" />
                {property.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5 text-gray-400" />
                {formatArea(property.area)}
              </span>
              {property.owner.isVerified && (
                <span className="ml-auto flex items-center gap-0.5 text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onGuestContinue={handleGuestContinue}
      />
    </>
  );
}

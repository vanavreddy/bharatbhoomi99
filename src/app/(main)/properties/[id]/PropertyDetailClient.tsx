'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Badge } from '@/components/ui';
import { useProperty } from '@/hooks';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts';
import { trackPropertyView } from '@/lib/services/statsService';
import { LoginPromptModal } from '@/components/modals/LoginPromptModal';
import { EnquiryModal } from '@/components/modals/EnquiryModal';
import { HomeTourModal } from '@/components/modals/HomeTourModal';
import { formatPrice, formatArea, formatDate } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Sofa,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Verified,
  Clock,
  Eye,
  Calendar,
  Building,
  Compass,
  Layers,
  Zap,
  Droplets,
  Car,
  Shield,
  Wifi,
  Wind,
  Dumbbell,
  Trees,
  RefreshCw,
  AlertTriangle,
  WifiOff,
  Share2,
  Heart,
  X,
} from 'lucide-react';

// Icon mapping for amenities
const amenityIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  parking: Car,
  lift: Building,
  'power-backup': Zap,
  'water-supply': Droplets,
  ac: Wind,
  wifi: Wifi,
  'washing-machine': Droplets,
  refrigerator: Square,
  security: Shield,
  cctv: Eye,
  'fire-safety': Zap,
  gated: Shield,
  gym: Dumbbell,
  'swimming-pool': Droplets,
  garden: Trees,
  clubhouse: Building,
};

interface PropertyPageProps {
  params: { id: string };
}

// Loading skeleton for the page
function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-6">
          {/* Breadcrumb skeleton */}
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery skeleton */}
              <div className="aspect-[16/10] bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-20 h-16 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>

              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>

              {/* Features skeleton */}
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// Error state component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  const isNetworkError = error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          {isNetworkError ? (
            <WifiOff className="h-10 w-10 text-red-500" />
          ) : (
            <AlertTriangle className="h-10 w-10 text-red-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isNetworkError ? 'Connection Error' : 'Something went wrong'}
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {isNetworkError
            ? 'Please check your internet connection and try again.'
            : error}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    </div>
  );
}

// Image gallery component
function ImageGallery({ images, title, isLoggedIn, onLoginPrompt }: { images: readonly { id: string; url: string; alt: string; isPrimary: boolean }[]; title: string; isLoggedIn: boolean; onLoginPrompt: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const selectedImage = images[selectedIndex] || primaryImage;

  // Limit visible images for non-logged-in users
  const MAX_FREE_IMAGES = 2;
  const visibleImages = isLoggedIn ? images : images.slice(0, MAX_FREE_IMAGES);
  const hasHiddenImages = !isLoggedIn && images.length > MAX_FREE_IMAGES;

  if (!images.length || !selectedImage) {
    return (
      <div className="aspect-[16/10] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400">No images available</p>
        </div>
      </div>
    );
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isLoggedIn && selectedIndex >= MAX_FREE_IMAGES - 1) {
      onLoginPrompt();
      return;
    }
    setSelectedIndex((prev) => (prev === visibleImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? visibleImages.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Main Image */}
      <div
        className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
        onClick={() => isLoggedIn ? setIsLightboxOpen(true) : onLoginPrompt()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && (isLoggedIn ? setIsLightboxOpen(true) : onLoginPrompt())}
      >
        {failedImages.has(selectedImage.id) ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Building className="h-12 w-12 text-gray-300" />
          </div>
        ) : (
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            onError={() => handleImageError(selectedImage.id)}
          />
        )}

        {/* Navigation arrows */}
        {visibleImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrev(e); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNext(e); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-sm rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* View all photos / Sign in to see more */}
        {hasHiddenImages ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onLoginPrompt(); }}
            className="absolute bottom-4 left-4 px-3 py-1.5 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-primary-dark transition-colors"
          >
            Sign in to see all {images.length} photos
          </button>
        ) : images.length > 1 ? (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 text-gray-700 text-sm font-medium rounded-full hover:bg-white transition-colors">
            View all photos
          </div>
        ) : null}
      </div>

      {/* Thumbnails */}
      {visibleImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {visibleImages.slice(0, 6).map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden ${
                selectedIndex === index ? 'ring-2 ring-brand-primary' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {failedImages.has(image.id) ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Building className="h-4 w-4 text-gray-300" />
                </div>
              ) : (
                <Image
                  src={image.url}
                  alt={image.alt || `Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  onError={() => handleImageError(image.id)}
                />
              )}
            </button>
          ))}
          {hasHiddenImages && (
            <button
              type="button"
              onClick={onLoginPrompt}
              className="w-20 h-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors"
            >
              +{images.length - MAX_FREE_IMAGES}
            </button>
          )}
          {isLoggedIn && images.length > 6 && (
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="w-20 h-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              +{images.length - 6}
            </button>
          )}
        </div>
      )}

      {/* Lightbox - only for logged-in users */}
      {isLightboxOpen && isLoggedIn && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative w-full max-w-5xl aspect-[16/10] mx-4">
            {failedImages.has(selectedImage.id) ? (
              <div className="w-full h-full flex items-center justify-center">
                <Building className="h-16 w-16 text-gray-500" />
              </div>
            ) : (
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || title}
                fill
                className="object-contain"
                sizes="100vw"
                onError={() => handleImageError(selectedImage.id)}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

export default function PropertyDetailClient({ params }: PropertyPageProps) {
  const { id } = params;
  const { property, isLoading, error, refetch } = useProperty(id);
  const { user, isAuthenticated, isGuest } = useAuth();
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  const isLoggedIn = isAuthenticated && !isGuest;
  const propertyIdNum = Number(id);
  const favorited = isFavorited(propertyIdNum);

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (favorited) {
      removeFavorite(propertyIdNum);
    } else {
      addFavorite(propertyIdNum);
    }
  };

  // Track view on mount
  useEffect(() => {
    if (property) {
      trackPropertyView(
        property.id,
        user ? { id: user.id, phone: user.phone, name: user.name } : undefined
      );
      // Also track via BB backend (fire and forget)
      fetch('/api/analytics/property-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: Number(property.id),
          userId: user?.id || undefined,
          sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('bb_session_id') || undefined : undefined,
        }),
      }).catch(() => {/* silent fail for analytics */});
    }
  }, [property, user]);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-6">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="flex items-center gap-2 text-sm">
              <Link href={ROUTES.HOME} className="text-gray-500 hover:text-brand-primary">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link href={ROUTES.PROPERTIES} className="text-gray-500 hover:text-brand-primary">
                Properties
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {property.title}
              </span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative">
                <ImageGallery images={property.images} title={property.title} isLoggedIn={isLoggedIn} onLoginPrompt={() => setShowLoginModal(true)} />

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${favorited ? 'text-red-500' : 'text-gray-600'}`}
                    aria-label={favorited ? 'Remove from favorites' : 'Save'}
                  >
                    <Heart className="h-5 w-5" fill={favorited ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {property.isFeatured && (
                    <Badge variant="accent" size="lg">Featured</Badge>
                  )}
                  <Badge variant="primary" size="lg">
                    For Sale
                  </Badge>
                </div>
              </div>

              {/* Property Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <p className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5 text-brand-primary flex-shrink-0" />
                      <span>
                        {property.address.street && `${property.address.street}, `}
                        {property.address.locality}, {property.address.city}, {property.address.state}
                        {property.address.pincode && ` - ${property.address.pincode}`}
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                        <Bed className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                        <div className="text-sm text-gray-500">Bedrooms</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                      <Bath className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{property.bathrooms}</div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                      <Square className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{formatArea(property.area)}</div>
                      <div className="text-sm text-gray-500">Area</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                      <Sofa className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 capitalize">{property.furnishing.replace('-', ' ')}</div>
                      <div className="text-sm text-gray-500">Furnishing</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description || 'No description available.'}
                </p>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Building className="h-4 w-4" />
                      Property Type
                    </span>
                    <span className="font-medium text-gray-900 capitalize">{property.type}</span>
                  </div>
                  {property.floor !== undefined && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Layers className="h-4 w-4" />
                        Floor
                      </span>
                      <span className="font-medium text-gray-900">
                        {property.floor} of {property.totalFloors || 'N/A'}
                      </span>
                    </div>
                  )}
                  {property.facing && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Compass className="h-4 w-4" />
                        Facing
                      </span>
                      <span className="font-medium text-gray-900">{property.facing}</span>
                    </div>
                  )}
                  {property.ageOfProperty !== undefined && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        Age of Property
                      </span>
                      <span className="font-medium text-gray-900">{property.ageOfProperty} years</span>
                    </div>
                  )}
                  {property.balconies !== undefined && property.balconies > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Square className="h-4 w-4" />
                        Balconies
                      </span>
                      <span className="font-medium text-gray-900">{property.balconies}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Available From
                    </span>
                    <span className="font-medium text-gray-900">{formatDate(property.availableFrom)}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.amenities.map((amenity) => {
                      const IconComponent = amenityIconMap[amenity.id] || Shield;
                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <IconComponent className="h-5 w-5 text-brand-primary" />
                          <span className="text-sm text-gray-700">{amenity.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location */}
              {property.address.landmark && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="text-gray-700 mb-1">
                        {property.address.street && `${property.address.street}, `}
                        {property.address.locality}, {property.address.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        Landmark: {property.address.landmark}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
                {/* Owner Info */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
                  <div className="relative w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    {property.owner.avatar ? (
                      <Image
                        src={property.owner.avatar}
                        alt={property.owner.name}
                        fill
                        className="rounded-full object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-brand-primary">
                        {property.owner.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-gray-900 truncate ${!isLoggedIn ? 'blur-sm select-none' : ''}`}>
                        {property.owner.name}
                      </span>
                      {property.owner.isVerified && (
                        <Verified className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">Property Owner</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      size="lg"
                      leftIcon={<Phone className="h-5 w-5" />}
                      onClick={() => {
                        // Track contact view then open phone
                        if (property && user) {
                          fetch(`/api/properties/${property.id}/contact-view`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'X-BB-User-Id': String(user.id) },
                            body: JSON.stringify({ propertyId: Number(property.id), viewerUserId: user.id, ownerUserId: Number(property.owner.id) }),
                          }).catch(() => {});
                        }
                        if (property?.owner?.phone) {
                          window.location.href = `tel:${property.owner.phone}`;
                        }
                      }}
                    >
                      Call Owner
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="outline"
                      leftIcon={<MessageCircle className="h-5 w-5" />}
                      onClick={() => setShowEnquiryModal(true)}
                    >
                      Send Message
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="outline"
                      leftIcon={<Calendar className="h-5 w-5" />}
                      onClick={() => setShowTourModal(true)}
                    >
                      Schedule Tour
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="space-y-3 blur-sm pointer-events-none select-none">
                      <Button fullWidth size="lg" leftIcon={<Phone className="h-5 w-5" />}>
                        Call Owner
                      </Button>
                      <Button fullWidth size="lg" variant="outline" leftIcon={<MessageCircle className="h-5 w-5" />}>
                        Send Message
                      </Button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="rounded-xl shadow-lg"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Sign in to Contact
                      </Button>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {property.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(property.createdAt)}
                  </span>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Tips
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• Never pay before visiting the property</li>
                  <li>• Verify owner's identity and documents</li>
                  <li>• Read the agreement carefully before signing</li>
                  <li>• Report suspicious listings to us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      {property && user && (
        <>
          <EnquiryModal
            isOpen={showEnquiryModal}
            onClose={() => setShowEnquiryModal(false)}
            propertyId={Number(property.id)}
            userId={user.id}
            propertyTitle={property.title}
          />
          <HomeTourModal
            isOpen={showTourModal}
            onClose={() => setShowTourModal(false)}
            propertyId={Number(property.id)}
            userId={user.id}
            propertyTitle={property.title}
          />
        </>
      )}
    </div>
  );
}

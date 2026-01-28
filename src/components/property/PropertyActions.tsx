'use client';

import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';

interface PropertyActionsProps {
  propertyId: string;
  className?: string;
}

export function PropertyActions({ propertyId, className }: PropertyActionsProps) {
  const handleFavorite = () => {
    // TODO: Add to favorites
    console.log('Add to favorites:', propertyId);
  };

  const handleShare = () => {
    // TODO: Share property
    if (navigator.share) {
      navigator.share({
        title: 'Check out this property',
        url: window.location.href,
      });
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        aria-label="Add to favorites"
        onClick={handleFavorite}
      >
        <Heart className="h-5 w-5 text-gray-600" />
      </button>
      <button
        type="button"
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        aria-label="Share property"
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}

interface ThumbnailGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

export function ThumbnailGallery({ images }: ThumbnailGalleryProps) {
  if (images.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {images.map((image) => (
        <button
          key={image.id}
          type="button"
          className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-brand-primary focus:border-brand-primary focus:outline-none"
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="96px"
          />
        </button>
      ))}
    </div>
  );
}

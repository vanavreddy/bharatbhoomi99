import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';
import { Button, Badge, Card } from '@/components/ui';
import { PropertyActions, ThumbnailGallery } from '@/components/property';
import { getPropertyById, MOCK_PROPERTIES } from '@/data/properties';
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
  Verified,
  Clock,
  Eye,
} from 'lucide-react';

interface PropertyPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return MOCK_PROPERTIES.map((property) => ({
    id: property.id,
  }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = getPropertyById(params.id);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
    },
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <div className="py-8">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            href={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
              {primaryImage && (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                {property.isFeatured && (
                  <Badge variant="accent">Featured</Badge>
                )}
                <Badge variant="primary">
                  For {property.listingType === 'rent' ? 'Rent' : property.listingType === 'sale' ? 'Sale' : 'Lease'}
                </Badge>
              </div>
              <PropertyActions
                propertyId={property.id}
                className="absolute top-4 right-4 flex gap-2"
              />
            </div>

            {/* Thumbnail Gallery */}
            <ThumbnailGallery images={property.images.map(img => ({ id: img.id, url: img.url, alt: img.alt }))} />

            {/* Property Details */}
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <p className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 text-brand-primary" />
                {property.address.street}, {property.address.locality}, {property.address.city}, {property.address.state} - {property.address.pincode}
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Bed className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                      <div className="font-semibold">{property.bedrooms} BHK</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Bath className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Square className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Area</div>
                    <div className="font-semibold">{formatArea(property.area)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Sofa className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Furnishing</div>
                    <div className="font-semibold capitalize">{property.furnishing.replace('-', ' ')}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Property Details Table */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Property Type</span>
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                  {property.floor !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Floor</span>
                      <span className="font-medium">{property.floor} of {property.totalFloors}</span>
                    </div>
                  )}
                  {property.facing && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Facing</span>
                      <span className="font-medium">{property.facing}</span>
                    </div>
                  )}
                  {property.ageOfProperty !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Age of Property</span>
                      <span className="font-medium">{property.ageOfProperty} years</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Available From</span>
                    <span className="font-medium">{formatDate(property.availableFrom)}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity.id} variant="outline" size="lg">
                        {amenity.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card padding="lg" className="sticky top-24">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                  {property.listingType === 'rent' && (
                    <span className="text-lg font-normal text-gray-500">
                      /{property.priceUnit === 'month' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {property.securityDeposit && (
                  <p className="text-sm text-gray-500 mt-1">
                    Security Deposit: {formatPrice(property.securityDeposit)}
                  </p>
                )}
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 py-4 border-t border-b border-gray-100 mb-4">
                <div className="relative w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  {property.owner.avatar ? (
                    <Image
                      src={property.owner.avatar}
                      alt={property.owner.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-brand-primary">
                      {property.owner.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{property.owner.name}</span>
                    {property.owner.isVerified && (
                      <Verified className="h-4 w-4 text-semantic-success" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Property Owner</span>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <Button fullWidth leftIcon={<Phone className="h-5 w-5" />}>
                  Call Owner
                </Button>
                <Button fullWidth variant="outline" leftIcon={<MessageCircle className="h-5 w-5" />}>
                  Send Message
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {property.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Listed {formatDate(property.createdAt)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

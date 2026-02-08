'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { PropertyGrid } from '@/components/property';
import { Button } from '@/components/ui';
import { getBuilderBySlug, ROUTES } from '@/lib/constants';
import { usePropertySearch } from '@/hooks';
import {
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default function BuilderDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [imgError, setImgError] = useState(false);

  const builder = getBuilderBySlug(slug);

  // Search for properties by builder name
  const { properties, isSearching, error } = usePropertySearch({
    query: builder?.name || '',
    enabled: !!builder,
    limit: 12,
  });

  // 404 state
  if (!builder) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Builder Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The builder you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href={ROUTES.BUILDERS}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Builders
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link
                    href={ROUTES.HOME}
                    className="text-gray-500 hover:text-brand-primary"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href={ROUTES.BUILDERS}
                    className="text-gray-500 hover:text-brand-primary"
                  >
                    Builders
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">{builder.name}</li>
              </ol>
            </nav>

            {/* Builder Info */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Builder Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {!imgError ? (
                  <Image
                    src={builder.logo}
                    alt={`${builder.name} logo`}
                    width={100}
                    height={100}
                    className="max-w-[80px] md:max-w-[100px] max-h-[60px] md:max-h-[80px] object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    className={`${builder.color} w-full h-full flex items-center justify-center`}
                  >
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {builder.initials}
                    </span>
                  </div>
                )}
              </div>

              {/* Builder Details */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {builder.name}
                </h1>
                <p className="text-gray-600 mb-6 max-w-2xl">
                  {builder.description}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {builder.projectCount}+
                      </div>
                      <div className="text-sm text-gray-500">Projects</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {builder.established}
                      </div>
                      <div className="text-sm text-gray-500">Established</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {builder.headquarters}
                      </div>
                      <div className="text-sm text-gray-500">Headquarters</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Properties Section */}
      <Container className="py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Properties by {builder.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {properties.length > 0
                ? `Found ${properties.length} properties`
                : 'Searching for properties...'}
            </p>
          </div>

          <Link href={`${ROUTES.PROPERTIES}?search=${encodeURIComponent(builder.name)}`}>
            <Button variant="outline" size="sm">
              View All
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <PropertyGrid
          properties={properties}
          isLoading={isSearching}
          emptyMessage={`No properties found for ${builder.name}. Check back soon for new listings.`}
          columns={4}
        />

        {/* Back to Builders */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            href={ROUTES.BUILDERS}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Builders
          </Link>
        </div>
      </Container>
    </main>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import { useBuilders } from '@/contexts';
import { Building2, MapPin, Calendar } from 'lucide-react';

export default function BuildersClient() {
  const { activeBuilders } = useBuilders();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header - responsive */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-6 sm:py-8 md:py-12">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-brand-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Popular Builders
                </h1>
                <p className="text-sm sm:text-base text-gray-600">in Bangalore</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              Explore premium properties from Bangalore&apos;s most trusted real estate developers.
              Find your dream home from builders with proven track records.
            </p>
          </div>
        </Container>
      </div>

      {/* Builders Grid - responsive */}
      <Container className="py-6 sm:py-8 md:py-12">
        {activeBuilders.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Building2 className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Builders Available Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We are currently onboarding trusted builders in Bangalore. Check back soon for verified builder listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {activeBuilders.map((builder) => (
              <Link
                key={builder.id}
                href={ROUTES.BUILDER_DETAIL(builder.slug)}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-brand-primary hover:shadow-lg transition-all"
              >
                {/* Builder Logo Header */}
                <div className="bg-gray-50 p-4 sm:p-6 flex items-center justify-center h-24 sm:h-32">
                  <Image
                    src={builder.logo}
                    alt={`${builder.name} logo`}
                    width={120}
                    height={80}
                    className="max-w-[80px] sm:max-w-[120px] max-h-[50px] sm:max-h-[70px] object-contain"
                  />
                </div>

                {/* Builder Info */}
                <div className="p-3 sm:p-4 md:p-5">
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-brand-primary transition-colors truncate">
                    {builder.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
                    {builder.shortDescription}
                  </p>

                  {/* Stats - responsive */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{builder.projectCount}+ projects</span>
                    </div>
                    <div className="flex items-center gap-1 hidden md:flex">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Est. {builder.established}</span>
                    </div>
                  </div>

                  {/* Headquarters - hidden on mobile */}
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 hidden sm:block">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{builder.headquarters}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}

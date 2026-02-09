'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import { useBuilders } from '@/contexts';
import type { Builder } from '@/types';
import {
  Search,
  MapPin,
  Building2,
  Home,
  Briefcase,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const listingTabs = [
  { id: 'rent', label: 'Rent', icon: Home },
  { id: 'buy', label: 'Buy', icon: Building2 },
  { id: 'commercial', label: 'Commercial', icon: Briefcase },
];

// Builder Card Component - responsive with logo
function BuilderCard({ builder, onClick }: { builder: Builder; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-brand-primary hover:shadow-md transition-all text-left w-full"
    >
      {/* Stack on mobile, row on larger */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
        {/* Logo with fallback to initials */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {!imgError ? (
            <Image
              src={builder.logo}
              alt={`${builder.name} logo`}
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className={`w-full h-full ${builder.color} flex items-center justify-center text-white font-bold text-sm sm:text-lg`}>
              {builder.initials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-brand-primary transition-colors">
            {builder.name}
          </h3>
          <p className="text-[10px] sm:text-sm text-gray-500 truncate">{builder.projectCount}+ projects</p>
        </div>
      </div>
    </button>
  );
}

const propertyTypes = [
  { label: 'Flat/Apartment', value: 'apartment' },
  { label: 'House/Villa', value: 'villa' },
  { label: 'Plot/Land', value: 'plot' },
  { label: 'Office Space', value: 'office' },
];

export function Hero() {
  const router = useRouter();
  const { activeBuilders } = useBuilders();
  const [activeTab, setActiveTab] = useState('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const togglePropertyType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeTab) params.set('listing', activeTab);
    if (selectedTypes.length > 0) params.set('type', selectedTypes.join(','));
    router.push(`${ROUTES.PROPERTIES}?${params.toString()}`);
  };

  const handleBuilderClick = (slug: string) => {
    router.push(ROUTES.BUILDER_DETAIL(slug));
  };

  // Generate dynamic search context text
  const getSearchContext = () => {
    const tabLabels: Record<string, string> = {
      rent: 'Rent',
      buy: 'Buy',
      commercial: 'Commercial Space',
    };

    const typeLabels: Record<string, string> = {
      apartment: 'Apartments',
      villa: 'Houses/Villas',
      plot: 'Plots/Land',
      office: 'Office Spaces',
    };

    const parts: string[] = [];

    // What type
    if (selectedTypes.length > 0) {
      const types = selectedTypes.map((t) => typeLabels[t]).join(' & ');
      parts.push(types);
    } else {
      parts.push('Properties');
    }

    // For what purpose
    parts.push(`for ${tabLabels[activeTab]}`);

    // Where
    if (searchQuery.trim()) {
      parts.push(`in ${searchQuery}`);
    } else {
      parts.push('in Bangalore');
    }

    return parts.join(' ');
  };

  // Count display
  const getResultsHint = () => {
    if (selectedTypes.length === 0 && !searchQuery.trim()) {
      return '10,000+ verified listings';
    }
    if (selectedTypes.length > 0 || searchQuery.trim()) {
      return 'Search to see matching properties';
    }
    return '';
  };

  return (
    <section className="relative overflow-hidden min-h-screen -mt-[72px] pt-[72px]">
      {/* Modern Background with Gradient Mesh & Spotlight - Full viewport behind navbar */}
      <div className="absolute inset-0 -top-[72px]">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50" />

        {/* Spotlight glow - top left - responsive sizes */}
        <div className="absolute -top-12 -left-12 md:-top-24 md:-left-24 w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-brand-primary/15 rounded-full blur-[60px] md:blur-[100px]" />

        {/* Spotlight glow - top right - responsive sizes */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] bg-brand-secondary/20 rounded-full blur-[50px] md:blur-[80px]" />

        {/* Accent orb - center right - responsive sizes */}
        <div className="absolute top-1/3 -right-16 md:-right-32 w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] bg-brand-accent/10 rounded-full blur-[40px] md:blur-[60px]" />

        {/* Accent orb - bottom left - responsive sizes */}
        <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-t from-brand-primary/10 to-transparent rounded-full blur-[60px] md:blur-[100px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Top edge fade */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

        {/* Bottom fade to white for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <Container className="relative">
        {/* Content centered in viewport with padding for navbar */}
        <div className="min-h-screen flex flex-col justify-center pt-20 pb-12 md:pt-24 md:pb-16">
          {/* Headline - responsive */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              Find a home you&apos;ll love
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Discover rental properties across India with verified listings and transparent pricing
            </p>
          </div>

          {/* Search Card - responsive width: full on mobile, 80% on tablet, 60% on desktop */}
          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[65%] xl:w-[60%] mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-brand-primary/10 border border-white/60 overflow-hidden">
              {/* Tabs - responsive with icons on mobile, full labels on desktop */}
              <div className="flex border-b border-gray-100">
                {listingTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-brand-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 sm:h-4 sm:w-4" />
                    <span className="text-[10px] sm:text-sm leading-tight text-center">{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-2 right-2 sm:left-0 sm:right-0 h-0.5 bg-brand-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="p-4 md:p-6">
                {/* Dynamic Search Context - responsive */}
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg sm:rounded-xl border border-brand-primary/10">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                    <span className="text-brand-primary">Searching:</span>{' '}
                    {getSearchContext()}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{getResultsHint()}</p>
                </div>

                {/* Location Search - responsive height and text */}
                <div className="relative mb-3 sm:mb-4">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-brand-primary" />
                  <input
                    type="text"
                    placeholder="Location - Koramangala, HSR..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Property Type Chips - responsive sizing */}
                <div className="mb-4">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Property Type</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {propertyTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => togglePropertyType(type.value)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                          selectedTypes.includes(type.value)
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Button - responsive */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Search Properties
                </Button>
              </form>
            </div>
          </div>

          {/* Bangalore & Builders Section */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            {/* Bangalore Featured - responsive padding and layout */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-xl sm:rounded-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-brand-primary" />
                    <span className="text-xs sm:text-sm font-medium text-brand-primary uppercase tracking-wide">
                      Featured City
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Properties in Bangalore
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                    Discover premium properties from top builders in India&apos;s Silicon Valley
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`${ROUTES.PROPERTIES}?search=Bangalore`)}
                  size="lg"
                  className="w-full sm:w-auto whitespace-nowrap text-sm sm:text-base"
                >
                  Explore All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Popular Builders Grid - responsive */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                Popular Builders
              </h2>
              <button
                type="button"
                onClick={() => router.push(ROUTES.BUILDERS)}
                className="text-xs sm:text-sm font-medium text-brand-primary hover:text-brand-primary-dark flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* Builder grid - 2 cols on mobile, 3 on tablet, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {activeBuilders.slice(0, 8).map((builder) => (
                <BuilderCard
                  key={builder.id}
                  builder={builder}
                  onClick={() => handleBuilderClick(builder.slug)}
                />
              ))}
            </div>
          </div>

          {/* Stats Bar - responsive */}
          <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center p-3 sm:p-4 bg-white/50 rounded-xl">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-primary">10K+</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Properties</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 rounded-xl">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-primary">50K+</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Happy Tenants</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 rounded-xl">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-primary">100%</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Verified</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

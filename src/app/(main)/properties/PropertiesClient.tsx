'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout';
import { Pagination } from '@/components/ui';
import { PropertyGrid } from '@/components/property';
import { usePropertySearch, useDebounce } from '@/hooks';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, MAJOR_CITIES } from '@/lib/constants';
import type { PropertyFilters, PropertyType, FurnishingStatus } from '@/types/property.types';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List,
  MapPin,
  Loader2,
  RefreshCw,
  AlertTriangle,
  WifiOff,
} from 'lucide-react';

const BEDROOM_OPTIONS = [
  { label: '1 BHK', value: '1' },
  { label: '2 BHK', value: '2' },
  { label: '3 BHK', value: '3' },
  { label: '4 BHK', value: '4' },
  { label: '4+ BHK', value: '5' },
];

const BUDGET_OPTIONS = [
  { label: 'Under ₹10,000', value: '0-10000' },
  { label: '₹10,000 - ₹20,000', value: '10000-20000' },
  { label: '₹20,000 - ₹35,000', value: '20000-35000' },
  { label: '₹35,000 - ₹50,000', value: '35000-50000' },
  { label: '₹50,000 - ₹75,000', value: '50000-75000' },
  { label: '₹75,000+', value: '75000-999999' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'date_newest' },
];

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Get filter values from URL
  const type = searchParams.get('type') || '';
  const city = searchParams.get('city') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const budget = searchParams.get('budget') || '';
  const furnishing = searchParams.get('furnishing') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Build filters object
  const buildFilters = useCallback((): PropertyFilters => {
    const filters: PropertyFilters = {};

    if (type) {
      filters.type = [type as PropertyType];
    }
    if (city) {
      filters.city = city;
    }
    if (bedrooms) {
      const beds = parseInt(bedrooms, 10);
      filters.bedrooms = beds === 5 ? [4, 5, 6, 7, 8] : [beds];
    }
    if (budget) {
      const parts = budget.split('-').map(Number);
      filters.minPrice = parts[0] ?? 0;
      filters.maxPrice = parts[1] ?? 999999999;
    }
    if (furnishing) {
      filters.furnishing = [furnishing as FurnishingStatus];
    }
    if (sort && sort !== 'relevance') {
      filters.sortBy = sort as PropertyFilters['sortBy'];
    }

    return filters;
  }, [type, city, bedrooms, budget, furnishing, sort]);

  // Use the property search hook
  const {
    properties,
    pagination,
    isLoading,
    isSearching,
    error,
    refetch,
    setFilters,
    setPage,
    search,
  } = usePropertySearch({
    page: currentPage,
    query: debouncedSearch || undefined,
    filters: buildFilters(),
    limit: 12,
  });

  // Update search when debounced value changes
  useEffect(() => {
    search(debouncedSearch);
  }, [debouncedSearch, search]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters(buildFilters());
  }, [buildFilters, setFilters]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filters change
    params.delete('page');
    router.push(`/properties?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    router.push(`/properties?${params.toString()}`);
    setPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchInput('');
    router.push('/properties');
  };

  const activeFilterCount = [type, city, bedrooms, budget, furnishing].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <Container>
          <div className="py-3 flex items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, project, or landmark..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-xs bg-brand-primary text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="h-10 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-6 lg:flex lg:gap-6">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-[140px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-brand-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* City Filter */}
              <div className="py-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">City</h3>
                <div className="space-y-2">
                  {MAJOR_CITIES.slice(0, 6).map((c) => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="city"
                        checked={city === c}
                        onChange={() => updateFilter('city', city === c ? '' : c)}
                        className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
                      />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Type Filter */}
              <div className="py-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Property Type</h3>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((t) => (
                    <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={type === t.value}
                        onChange={() => updateFilter('type', type === t.value ? '' : t.value)}
                        className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
                      />
                      <span className="text-sm text-gray-700">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div className="py-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => updateFilter('bedrooms', bedrooms === b.value ? '' : b.value)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        bedrooms === b.value
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="py-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Budget (per month)</h3>
                <div className="space-y-2">
                  {BUDGET_OPTIONS.map((b) => (
                    <label key={b.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        checked={budget === b.value}
                        onChange={() => updateFilter('budget', budget === b.value ? '' : b.value)}
                        className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
                      />
                      <span className="text-sm text-gray-700">{b.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Furnishing Filter */}
              <div className="py-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Furnishing</h3>
                <div className="space-y-2">
                  {FURNISHING_OPTIONS.map((f) => (
                    <label key={f.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="furnishing"
                        checked={furnishing === f.value}
                        onChange={() => updateFilter('furnishing', furnishing === f.value ? '' : f.value)}
                        className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
                      />
                      <span className="text-sm text-gray-700">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {isLoading || isSearching
                    ? 'Loading properties...'
                    : pagination
                    ? `${pagination.total}+ Properties`
                    : 'Properties'}
                  {city && !isLoading && ` in ${city}`}
                </h1>
                {(type || bedrooms) && !isLoading && (
                  <p className="text-sm text-gray-500">
                    {[type, bedrooms && `${bedrooms} BHK`].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    {error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch') ? (
                      <WifiOff className="h-6 w-6 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')
                      ? 'Connection Error'
                      : 'Something went wrong'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-md">
                    {error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')
                      ? 'Please check your internet connection and try again.'
                      : error}
                  </p>
                  <button
                    type="button"
                    onClick={refetch}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {city && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                    <MapPin className="h-3 w-3" />
                    {city}
                    <button type="button" onClick={() => updateFilter('city', '')} className="ml-1 hover:text-brand-primary-dark">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                    {PROPERTY_TYPES.find(t => t.value === type)?.label || type}
                    <button type="button" onClick={() => updateFilter('type', '')} className="ml-1 hover:text-brand-primary-dark">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {bedrooms && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                    {bedrooms} BHK
                    <button type="button" onClick={() => updateFilter('bedrooms', '')} className="ml-1 hover:text-brand-primary-dark">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {budget && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                    {BUDGET_OPTIONS.find(b => b.value === budget)?.label || budget}
                    <button type="button" onClick={() => updateFilter('budget', '')} className="ml-1 hover:text-brand-primary-dark">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {furnishing && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                    {FURNISHING_OPTIONS.find(f => f.value === furnishing)?.label || furnishing}
                    <button type="button" onClick={() => updateFilter('furnishing', '')} className="ml-1 hover:text-brand-primary-dark">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Property Grid */}
            <PropertyGrid
              properties={properties}
              variant={viewMode}
              columns={viewMode === 'grid' ? 3 : 2}
              isLoading={isLoading || isSearching}
              emptyMessage="No properties match your filters. Try adjusting your search criteria."
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && properties.length > 0 && (
              <div className="mt-8 mb-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="text-center text-sm text-gray-500 mt-4">
                  Showing {properties.length} of {pagination.total} properties
                </p>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}

// Full page loading skeleton
function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <Container>
          <div className="py-3 flex items-center gap-4">
            <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="hidden sm:block w-32 h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="hidden sm:flex w-20 h-10 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-6 lg:flex lg:gap-6">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="h-6 bg-gray-100 rounded w-20 animate-pulse" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-4 bg-gray-50 rounded w-full animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1 min-w-0">
            <div className="h-6 bg-gray-100 rounded w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200" />
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
              ))}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}

export default function PropertiesClient() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <PropertiesContent />
    </Suspense>
  );
}

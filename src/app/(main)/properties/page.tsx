import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { PropertyGrid } from '@/components/property';
import { Button, Input, Select, Badge } from '@/components/ui';
import { MOCK_PROPERTIES } from '@/data/properties';
import { PROPERTY_TYPES, SORT_OPTIONS, MAJOR_CITIES } from '@/lib/constants';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/constants/seo';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const metadata: Metadata = {
  title: PAGE_TITLES.properties,
  description: PAGE_DESCRIPTIONS.properties,
};

interface PropertiesPageProps {
  searchParams: {
    type?: string;
    city?: string;
    bedrooms?: string;
    sort?: string;
    q?: string;
  };
}

export default function PropertiesPage({ searchParams }: PropertiesPageProps) {
  // Filter properties based on search params
  let filteredProperties = [...MOCK_PROPERTIES];

  if (searchParams.type) {
    filteredProperties = filteredProperties.filter(
      (p) => p.type === searchParams.type
    );
  }

  if (searchParams.city) {
    filteredProperties = filteredProperties.filter(
      (p) => p.address.city.toLowerCase() === searchParams.city?.toLowerCase()
    );
  }

  if (searchParams.bedrooms) {
    const beds = parseInt(searchParams.bedrooms, 10);
    filteredProperties = filteredProperties.filter((p) => p.bedrooms === beds);
  }

  if (searchParams.q) {
    const query = searchParams.q.toLowerCase();
    filteredProperties = filteredProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.address.locality.toLowerCase().includes(query) ||
        p.address.city.toLowerCase().includes(query)
    );
  }

  // Sort
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case 'price_asc':
        filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case 'date_newest':
        filteredProperties.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'date_oldest':
        filteredProperties.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }
  }

  const activeFilters = Object.entries(searchParams).filter(
    ([key, value]) => value && key !== 'sort'
  );

  return (
    <div className="py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
            Browse Properties
          </h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                name="q"
                placeholder="Search by location, title..."
                defaultValue={searchParams.q}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>

            {/* Property Type */}
            <Select
              name="type"
              placeholder="Property Type"
              defaultValue={searchParams.type}
              options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            />

            {/* City */}
            <Select
              name="city"
              placeholder="City"
              defaultValue={searchParams.city}
              options={MAJOR_CITIES.map((c) => ({ value: c, label: c }))}
            />

            {/* Sort */}
            <div className="flex gap-2">
              <Select
                name="sort"
                placeholder="Sort By"
                defaultValue={searchParams.sort}
                options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
                className="flex-1"
              />
              <Button type="submit" variant="primary">
                <SlidersHorizontal className="h-5 w-5" />
                <span className="sr-only sm:not-sr-only sm:ml-2">Filter</span>
              </Button>
            </div>
          </form>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeFilters.map(([key, value]) => (
                <Badge key={key} variant="primary" size="sm" className="gap-1">
                  {key}: {value}
                  <a href={`/properties?${new URLSearchParams(
                    Object.fromEntries(
                      Object.entries(searchParams).filter(([k]) => k !== key)
                    )
                  ).toString()}`}>
                    <X className="h-3 w-3" />
                  </a>
                </Badge>
              ))}
              <a
                href="/properties"
                className="text-sm text-brand-primary hover:underline ml-2"
              >
                Clear all
              </a>
            </div>
          )}
        </div>

        {/* Property Grid */}
        <PropertyGrid
          properties={filteredProperties}
          emptyMessage="No properties match your filters. Try adjusting your search criteria."
        />
      </Container>
    </div>
  );
}

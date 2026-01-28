'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import {
  Search,
  MapPin,
  Building2,
  Home,
  Users,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

const listingTabs = [
  { id: 'rent', label: 'Rent', icon: Home },
  { id: 'buy', label: 'Buy', icon: Building2 },
  { id: 'pg', label: 'PG/Co-living', icon: Users },
  { id: 'commercial', label: 'Commercial', icon: Briefcase },
];

const popularCities = [
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=80' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80' },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80' },
];

const propertyTypes = [
  { label: 'Flat/Apartment', value: 'apartment' },
  { label: 'House/Villa', value: 'villa' },
  { label: 'PG/Hostel', value: 'pg' },
  { label: 'Office Space', value: 'office' },
];

export function Hero() {
  const router = useRouter();
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

  const handleCityClick = (city: string) => {
    router.push(`${ROUTES.PROPERTIES}?search=${city}`);
  };

  return (
    <section className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-white to-white" />

      <Container className="relative">
        <div className="pt-8 pb-16 md:pt-12 md:pb-24">
          {/* Headline */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Find a home you&apos;ll love
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Discover rental properties across India with verified listings and transparent pricing
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {listingTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-brand-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="p-4 md:p-6">
                {/* Location Search */}
                <div className="relative mb-4">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary" />
                  <input
                    type="text"
                    placeholder="Search by city, locality, or landmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Property Type Chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => togglePropertyType(type.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedTypes.includes(type.value)
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-base font-semibold rounded-xl"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </Button>
              </form>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="mt-12 md:mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                Popular Cities
              </h2>
              <button
                type="button"
                onClick={() => router.push(ROUTES.PROPERTIES)}
                className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
              {popularCities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => handleCityClick(city.name)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-end justify-center pb-3">
                    <span className="text-white font-medium text-sm md:text-base">
                      {city.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-primary">10K+</div>
              <div className="text-sm text-gray-500 mt-1">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-primary">50K+</div>
              <div className="text-sm text-gray-500 mt-1">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-primary">100%</div>
              <div className="text-sm text-gray-500 mt-1">Verified</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

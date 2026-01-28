'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  Building2,
  Users,
  Shield,
  ChevronDown,
} from 'lucide-react';

const stats = [
  { icon: Building2, value: '10,000+', label: 'Properties' },
  { icon: Users, value: '50,000+', label: 'Happy Tenants' },
  { icon: Shield, value: '100%', label: 'Verified' },
];

const propertyTypes = [
  { label: 'Any Type', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Villa', value: 'villa' },
  { label: 'PG/Hostel', value: 'pg' },
];

const budgetRanges = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹10,000', value: '0-10000' },
  { label: '₹10,000 - ₹25,000', value: '10000-25000' },
  { label: '₹25,000 - ₹50,000', value: '25000-50000' },
  { label: '₹50,000 - ₹1,00,000', value: '50000-100000' },
  { label: 'Above ₹1,00,000', value: '100000-999999' },
];

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedType) params.set('type', selectedType);
    if (selectedBudget) params.set('budget', selectedBudget);
    router.push(`${ROUTES.PROPERTIES}?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 md:py-16 lg:py-20">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-bold text-gray-900 leading-[1.1] mb-5">
              Find Your Perfect
              <span className="text-brand-primary"> Rental Home</span> in India
            </h1>

            {/* Subheadline */}
            <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Discover verified rental properties with transparent pricing.
              Apartments, houses, and villas in every major city.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="mb-10">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                {/* Search Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {/* Location Input */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label htmlFor="search-location" className="sr-only">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary" />
                      <input
                        id="search-location"
                        type="text"
                        placeholder="Enter city or area"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border-0 rounded-xl text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Property Type Select */}
                  <div>
                    <label htmlFor="search-type" className="sr-only">
                      Property Type
                    </label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary pointer-events-none" />
                      <select
                        id="search-type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full h-14 pl-12 pr-10 bg-gray-50 border-0 rounded-xl text-gray-900 text-[15px] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all"
                      >
                        {propertyTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Budget Select */}
                  <div>
                    <label htmlFor="search-budget" className="sr-only">
                      Budget
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary pointer-events-none" />
                      <select
                        id="search-budget"
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="w-full h-14 pl-12 pr-10 bg-gray-50 border-0 rounded-xl text-gray-900 text-[15px] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all"
                      >
                        {budgetRanges.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-[15px] font-semibold rounded-xl"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                  alt="Modern home interior"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 720px"
                />
              </div>

              {/* Floating Card - Verified */}
              <div className="hidden sm:flex absolute bottom-4 left-4 lg:-bottom-4 lg:-left-4 bg-white rounded-xl shadow-lg p-4 items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Verified Owners</div>
                  <div className="text-xs text-gray-500">100% Safe & Trusted</div>
                </div>
              </div>

              {/* Floating Card - Properties Count */}
              <div className="hidden sm:flex absolute top-4 right-4 lg:-top-4 lg:-right-4 bg-white rounded-xl shadow-lg p-4 items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">10,000+</div>
                  <div className="text-xs text-gray-500">Listed Properties</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import {
  Search,
  Home,
  Shield,
  Key,
  ArrowRight,
  CheckCircle2,
  Users,
  BadgeCheck,
  Clock,
  Banknote,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Search & Discover',
    description: 'Explore thousands of verified properties with advanced filters for location, budget, and preferences.',
    features: ['Smart search filters', 'Map-based browsing', 'Instant availability'],
    gradient: 'from-blue-500 to-cyan-400',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    id: 2,
    icon: Home,
    title: 'Visit & Experience',
    description: 'Schedule property visits at your convenience. Meet owners directly without any middlemen.',
    features: ['Flexible scheduling', 'Virtual tours', 'Direct owner contact'],
    gradient: 'from-violet-500 to-purple-400',
    bgGradient: 'from-violet-50 to-purple-50',
  },
  {
    id: 3,
    icon: Shield,
    title: 'Verify & Trust',
    description: 'Every listing is verified. Review authentic photos, documents, and transparent pricing.',
    features: ['Verified owners', 'Legal documentation', 'No hidden charges'],
    gradient: 'from-emerald-500 to-teal-400',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    id: 4,
    icon: Key,
    title: 'Move In',
    description: 'Complete rental agreement hassle-free and move into your new home with confidence.',
    features: ['Digital agreements', 'Secure payments', 'Move-in support'],
    gradient: 'from-orange-500 to-amber-400',
    bgGradient: 'from-orange-50 to-amber-50',
  },
];

const stats = [
  {
    icon: BadgeCheck,
    value: '100%',
    label: 'Verified Listings',
    description: 'Every property is verified by our team',
  },
  {
    icon: Banknote,
    value: '₹0',
    label: 'Brokerage',
    description: 'Zero brokerage, zero hidden fees',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Support',
    description: 'Round the clock assistance',
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Happy Tenants',
    description: 'Trusted by thousands of renters',
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-sm font-medium text-brand-primary">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-5">
            Your Journey to the
            <span className="block text-brand-primary">Perfect Home</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            We've simplified the rental process so you can focus on what matters most — finding your ideal living space.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group"
            >
              {/* Card */}
              <div className={`h-full p-6 md:p-8 rounded-2xl bg-gradient-to-br ${step.bgGradient} border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300`}>
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg mb-6`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  {step.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 rounded-3xl" />

          <div className="relative px-6 py-12 md:px-12 md:py-16 rounded-3xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm mb-4 group-hover:bg-white/20 transition-colors">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/90 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-white/60 text-sm hidden md:block">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Ready to find your perfect home?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ROUTES.PROPERTIES}>
              <Button size="lg" className="min-w-[200px]">
                Browse Properties
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href={ROUTES.LIST_PROPERTY}>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

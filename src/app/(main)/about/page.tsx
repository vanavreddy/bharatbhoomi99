import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { JsonLd } from '@/components/seo';
import { getPersonSchema } from '@/lib/seo';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/lib/constants/seo';
import { ROUTES } from '@/lib/constants';
import {
  Phone,
  MapPin,
  Building2,
  Users,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: PAGE_TITLES.about,
  description: PAGE_DESCRIPTIONS.about,
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: `${PAGE_TITLES.about} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.about,
    url: `${SITE_CONFIG.url}/about`,
    images: [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
  },
};

const stats = [
  { icon: Building2, value: '500+', label: 'Properties Sold' },
  { icon: Users, value: '1000+', label: 'Happy Families' },
  { icon: Award, value: '5+', label: 'Years Experience' },
  { icon: Clock, value: '24/7', label: 'Support' },
];

export default function AboutPage() {
  return (
    <div className="py-8 md:py-12">
      <JsonLd data={getPersonSchema()} />
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            About Bharat Bhoomi-99
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Your trusted family realtor in Bangalore, specializing in real estate, construction, and builders.
          </p>
        </div>

        {/* Owner + Brand Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Owner Card */}
          <Card padding="lg" className="flex flex-col items-center text-center">
            <div className="relative w-40 h-52 md:w-48 md:h-60 rounded-2xl overflow-hidden border-4 border-brand-primary/20 mb-6 bg-gray-50">
              <Image
                src="/images/userinfo/logo.jpeg"
                alt="Madhu Chandra - Bharat Bhoomi-99"
                fill
                className="object-contain"
                sizes="192px"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Madhu Chandra
            </h2>
            <p className="text-brand-primary font-semibold mb-4">
              Founder & Family Realtor
            </p>
            <p className="text-gray-600 max-w-md leading-relaxed mb-6">
              With over 5 years of experience in Bangalore&apos;s real estate market, Madhu Chandra has helped
              hundreds of families find their dream homes. As a family realtor, the focus has always been on
              trust, transparency, and building lasting relationships with clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-500">
              <a href="tel:+919448514449" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
                <Phone className="h-4 w-4" />
                +91 94485 14449
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a href="tel:+919900151820" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
                <Phone className="h-4 w-4" />
                +91 99001 51820
              </a>
            </div>
          </Card>

          {/* Brand Info Card */}
          <Card padding="lg" className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-xs h-36 md:h-44 mb-6">
              <Image
                src="/images/userinfo/primaryLogo.jpeg"
                alt="Bharat Bhoomi-99 Logo"
                fill
                className="object-contain"
                sizes="320px"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Real Estate | Construction | Builders
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Bharat Bhoomi-99 is a trusted name in Bangalore&apos;s real estate landscape. We connect buyers
              with top builders, provide construction guidance, and offer end-to-end support for property
              transactions. Our deep knowledge of the Bangalore market, especially areas around Chandapura,
              Dommasandra, and Electronic City, makes us the preferred choice for families looking to invest
              in property.
            </p>
            <div className="flex items-start gap-3 text-sm text-gray-500">
              <MapPin className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
              <span>
                No.99/1, Chandapura Dommasandra Road, Sri Bayalu Basaveshwara Swamy Temple,
                Kommasandra, Bengaluru - 562125
              </span>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} padding="lg" className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Services Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Estate</h3>
              <p className="text-sm text-gray-600">
                Buy, sell, or rent properties across Bangalore. We offer verified listings with
                transparent pricing and hassle-free transactions.
              </p>
            </Card>
            <Card padding="lg" className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Award className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Construction</h3>
              <p className="text-sm text-gray-600">
                End-to-end construction support from planning to execution. We connect you
                with reliable contractors and guide you through the process.
              </p>
            </Card>
            <Card padding="lg" className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Builders</h3>
              <p className="text-sm text-gray-600">
                We partner with Bangalore&apos;s most trusted builders to bring you premium projects at
                competitive prices. Explore properties from top developers.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Contact us today and let our team help you find the perfect property in Bangalore.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={ROUTES.PROPERTIES} className="flex items-center gap-2">
                Browse Properties
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.CONTACT}>
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

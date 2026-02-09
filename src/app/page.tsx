import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import {
  Hero,
  HowItWorks,
  PropertyTypes,
  Testimonials,
  CTASection,
} from '@/components/sections';
import { JsonLd } from '@/components/seo';
import { getLocalBusinessSchema } from '@/lib/seo';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/lib/constants/seo';

export const metadata: Metadata = {
  title: PAGE_TITLES.home,
  description: PAGE_DESCRIPTIONS.home,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={getLocalBusinessSchema()} />
      <Header />
      <main id="main-content">
        <Hero />
        <PropertyTypes />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

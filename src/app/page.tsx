import { Header, Footer, SkipLink } from '@/components/layout';
import {
  Hero,
  FeaturedProperties,
  PropertyTypes,
  Testimonials,
  CTASection,
} from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        <Hero />
        <PropertyTypes />
        <FeaturedProperties />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

import { Header, Footer } from '@/components/layout';
import {
  Hero,
  HowItWorks,
  PropertyTypes,
  Testimonials,
  CTASection,
} from '@/components/sections';

export default function HomePage() {
  return (
    <>
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

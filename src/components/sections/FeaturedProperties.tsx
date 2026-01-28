import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { PropertyGrid } from '@/components/property';
import { ROUTES } from '@/lib/constants';
import { getFeaturedProperties } from '@/data/properties';
import { ArrowRight } from 'lucide-react';

export function FeaturedProperties() {
  const featuredProperties = getFeaturedProperties();

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Handpicked properties that offer the best value and amenities for your needs.
            </p>
          </div>
          <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />} asChild>
            <Link href={ROUTES.PROPERTIES}>View All</Link>
          </Button>
        </div>

        <PropertyGrid properties={featuredProperties} />
      </Container>
    </section>
  );
}

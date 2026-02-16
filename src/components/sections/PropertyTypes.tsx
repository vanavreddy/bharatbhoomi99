import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { Building2, Home, Castle, Map, Store } from 'lucide-react';

const propertyTypes = [
  {
    type: 'apartment',
    label: 'Apartments',
    icon: Building2,
    description: 'Modern flats in prime locations',
  },
  {
    type: 'house',
    label: 'Houses',
    icon: Home,
    description: 'Independent houses for families',
  },
  {
    type: 'villa',
    label: 'Villas',
    icon: Castle,
    description: 'Luxury villas with premium amenities',
  },
  {
    type: 'plot',
    label: 'Plots',
    icon: Map,
    description: 'Land for your dream project',
  },
  {
    type: 'commercial',
    label: 'Commercial',
    icon: Store,
    description: 'Office spaces and shops',
  },
];

export function PropertyTypes() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Explore by Property Type
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you're looking for a cozy apartment or a spacious villa,
            we have options for every need and budget.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {propertyTypes.map((item) => (
            <Link
              key={item.type}
              href={`${ROUTES.PROPERTIES}?type=${item.type}`}
              className="group"
            >
              <Card
                padding="md"
                className="h-full text-center hover:border-brand-primary transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

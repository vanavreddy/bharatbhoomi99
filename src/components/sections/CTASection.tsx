import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import { Home, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="relative bg-brand-accent rounded-2xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20.5h18V22H22v18h-2V22H2v18H0V20.5h20z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Home className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 max-w-2xl mx-auto">
              Ready to Find Your Perfect Home?
            </h2>

            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of happy customers who found their dream property through Bharat Bhoomi-99.
              Start your search today!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                asChild
              >
                <Link href={ROUTES.PROPERTIES}>Start Searching</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-accent"
                asChild
              >
                <Link href={ROUTES.LIST_PROPERTY}>Sell Property for Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

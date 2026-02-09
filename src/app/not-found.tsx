import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Header, Footer, Container } from '@/components/layout';
import { ROUTES } from '@/lib/constants';
import { Home, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16">
        <Container size="sm">
          <div className="text-center">
            <h1 className="text-6xl font-heading font-bold text-brand-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button leftIcon={<Home className="h-5 w-5" />} asChild>
                <Link href={ROUTES.HOME}>Go Home</Link>
              </Button>
              <Button variant="outline" leftIcon={<Search className="h-5 w-5" />} asChild>
                <Link href={ROUTES.PROPERTIES}>Browse Properties</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

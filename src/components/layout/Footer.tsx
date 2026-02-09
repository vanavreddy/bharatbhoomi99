import Link from 'next/link';
import { Container } from './Container';
import { Logo } from './Logo';
import { ROUTES } from '@/lib/constants';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Builders', href: ROUTES.BUILDERS },
    { label: 'Contact Us', href: ROUTES.CONTACT },
  ],
  properties: [
    { label: 'Browse Properties', href: ROUTES.PROPERTIES },
    { label: 'List Your Property', href: ROUTES.LIST_PROPERTY },
    { label: 'Featured Listings', href: `${ROUTES.PROPERTIES}?featured=true` },
    { label: 'New Listings', href: `${ROUTES.PROPERTIES}?sort=newest` },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: ROUTES.CONTACT },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo />
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Your trusted family realtor in Bangalore. We specialize in real estate,
                construction, and connecting you with top builders for your dream home.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:contact@bharatbhoomi99.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  contact@bharatbhoomi99.com
                </a>
                <a
                  href="tel:+919448514449"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  +91 94485 14449
                </a>
                <a
                  href="tel:+919900151820"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  +91 99001 51820
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Kommasandra, Bengaluru - 562125</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Properties Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Properties</h3>
              <ul className="space-y-3">
                {footerLinks.properties.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bharat Bhoomi-99. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Real Estate | Construction | Builders
          </p>
        </div>
      </Container>
    </footer>
  );
}

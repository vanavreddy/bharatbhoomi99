import Link from 'next/link';
import { Container } from './Container';
import { Logo } from './Logo';
import { ROUTES } from '@/lib/constants';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
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

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

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
                Your trusted partner in finding the perfect rental property across India.
                Verified listings, transparent pricing, and hassle-free experience.
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
                  href="tel:+911234567890"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  +91 12345 67890
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bharat Bhoomi-99. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

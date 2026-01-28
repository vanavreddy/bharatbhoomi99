'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { Logo } from './Logo';
import { Button } from '@/components/ui';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { Menu, X, Plus, User, ChevronRight } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return pathname === '/properties' && href.includes(pathname);
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <Container>
        <nav className="flex h-[72px] items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-brand-primary'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link
              href={ROUTES.LIST_PROPERTY}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
              Post Property
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded">
                FREE
              </span>
            </Link>

            <div className="h-5 w-px bg-gray-200" />

            <Link
              href={ROUTES.SIGN_IN}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
            >
              <User className="h-4 w-4" />
              Login
            </Link>

            <Button size="sm" className="px-5" asChild>
              <Link href={ROUTES.SIGN_UP}>Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-white z-50 transition-all duration-200',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <Container className="py-4">
          {/* Nav Links */}
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'text-brand-primary bg-brand-primary/5'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>

          {/* Post Property */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              href={ROUTES.LIST_PROPERTY}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-brand-primary" />
                Post Property
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded">
                  FREE
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <Button variant="outline" fullWidth size="lg" asChild>
              <Link href={ROUTES.SIGN_IN} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
            </Button>
            <Button fullWidth size="lg" asChild>
              <Link href={ROUTES.SIGN_UP} onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}

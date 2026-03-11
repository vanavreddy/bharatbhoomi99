'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Button } from '@/components/ui';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { useAuth } from '@/contexts';
import { Menu, X, Plus, User, ChevronRight, Shield, LogOut, Heart, MessageCircle } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isGuest, signOut } = useAuth();

  const isAdmin = user?.role === 'admin';
  const showAuthButtons = !isAuthenticated || isGuest;

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return pathname === '/properties' && href.includes(pathname);
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Floating Glass Navbar - Crystal Clear Water Style */}
      <div className="px-3 sm:px-4 lg:px-6 pt-3">
        <nav
          className={cn(
            'relative mx-auto max-w-7xl rounded-[22px] overflow-hidden',
            'bg-transparent backdrop-blur-xl backdrop-saturate-150',
            'shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
            'border border-black/[0.04]',
            'ring-1 ring-black/[0.02]'
          )}
          style={{
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
          }}
          aria-label="Main navigation"
        >
          {/* Top refraction highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {/* Bottom subtle shadow line */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-black/[0.03] to-transparent" />
          <div className="flex h-[56px] sm:h-[60px] items-center justify-between px-4 sm:px-5">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation - Pill Style */}
            <div className="hidden lg:flex lg:items-center lg:gap-0.5 bg-gray-100/60 rounded-full px-1 py-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-white text-brand-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <Link
                href={ROUTES.LIST_PROPERTY}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-100/60"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xl:inline">Post Property</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full">
                  FREE
                </span>
              </Link>

              <div className="h-5 w-px bg-gray-200/60" />

              {isAdmin && (
                <Link
                  href={ROUTES.ADMIN}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-100/60"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden xl:inline">Admin</span>
                </Link>
              )}

              {showAuthButtons ? (
                <>
                  <Link
                    href={ROUTES.SIGN_IN}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-100/60"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline">Login</span>
                  </Link>

                  <Button size="sm" className="px-4 rounded-full shadow-sm" asChild>
                    <Link href={ROUTES.SIGN_UP}>Sign Up</Link>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href={ROUTES.FAVORITES}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-100/60"
                    title="Favorites"
                  >
                    <Heart className="h-4 w-4" />
                  </Link>
                  <Link
                    href={ROUTES.ENQUIRIES}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-100/60"
                    title="Enquiries"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                  <div className="h-5 w-px bg-gray-200/60" />
                  <span className="text-sm text-gray-700 font-medium hidden xl:inline">
                    {user?.name || 'User'}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={cn(
                'lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200',
                isMobileMenuOpen
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden fixed inset-x-3 top-[76px] z-50 transition-all duration-300 ease-out',
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div
          className="relative rounded-[22px] border border-black/[0.04] ring-1 ring-black/[0.02] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] overflow-hidden backdrop-blur-xl backdrop-saturate-150"
          style={{
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
          }}
        >
          {/* Top refraction highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="p-4">
            {/* Nav Links */}
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl transition-all duration-200',
                    isActive(item.href)
                      ? 'text-brand-primary bg-brand-primary/10'
                      : 'text-gray-700 hover:bg-gray-100/60 active:bg-gray-100'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Post Property */}
            <Link
              href={ROUTES.LIST_PROPERTY}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-brand-primary" />
                </div>
                Post Property
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full">
                  FREE
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>

            {/* Admin link for mobile */}
            {isAdmin && (
              <Link
                href={ROUTES.ADMIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-brand-primary" />
                  </div>
                  Admin Panel
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            )}

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* User Links */}
            {!showAuthButtons && (
              <>
                <Link
                  href={ROUTES.FAVORITES}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-red-500" />
                    </div>
                    Favorites
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href={ROUTES.ENQUIRIES}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-brand-primary" />
                    </div>
                    Enquiries
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </>
            )}

            {/* Auth Buttons */}
            {showAuthButtons ? (
              <div className="flex gap-3">
                <Button variant="outline" fullWidth className="rounded-xl" asChild>
                  <Link href={ROUTES.SIGN_IN} onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button fullWidth className="rounded-xl shadow-sm" asChild>
                  <Link href={ROUTES.SIGN_UP} onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                <button
                  type="button"
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 top-[76px] bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />
    </header>
  );
}

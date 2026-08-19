'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { hasAdminPermission, ADMIN_ROLE_LABELS, type AdminRole } from '@/types';
import {
  LayoutDashboard,
  Building2,
  LogOut,
  Home as HomeIcon,
  FileText,
  Mail,
  Users,
  Shield,
  UserRound,
} from 'lucide-react';

interface SidebarLink {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  permission?: string;
}

const allSidebarLinks: SidebarLink[] = [
  { label: 'Dashboard', href: ROUTES.ADMIN, icon: LayoutDashboard, permission: 'view_dashboard' },
  { label: 'Properties', href: ROUTES.ADMIN_PROPERTIES, icon: FileText, permission: 'view_properties' },
  { label: 'Builders', href: ROUTES.ADMIN_BUILDERS, icon: Building2, permission: 'manage_builders' },
  { label: 'Contacts', href: ROUTES.ADMIN_CONTACTS, icon: Mail, permission: 'manage_contacts' },
  { label: 'Users', href: ROUTES.ADMIN_USERS, icon: UserRound, permission: 'manage_users' },
  { label: 'Team', href: ROUTES.ADMIN_TEAM, icon: Users, permission: 'manage_team' },
];

// Pages that bypass the admin layout entirely
const BYPASS_LAYOUT_PAGES = [ROUTES.ADMIN_LOGIN, ROUTES.ADMIN_JOIN];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user?.role === 'admin';
  const isBypassPage = BYPASS_LAYOUT_PAGES.some(p => pathname?.startsWith(p));

  // Get team role from localStorage user object
  const teamRole = useMemo(() => {
    if (typeof window === 'undefined') return 'viewer';
    try {
      const stored = localStorage.getItem('bharatbhoomi_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const role = parsed.teamRole;
        return typeof role === 'string' && role.length > 0 ? role : 'viewer';
      }
    } catch { /* ignore */ }
    return 'viewer';
  }, [user]);

  const visibleLinks = useMemo(() => {
    return allSidebarLinks.filter(link =>
      !link.permission || hasAdminPermission(teamRole, link.permission)
    );
  }, [teamRole]);

  useEffect(() => {
    if (!isLoading && !isBypassPage) {
      if (!isAuthenticated || !isAdmin) {
        router.push(ROUTES.ADMIN_LOGIN);
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, isBypassPage, router]);

  // Show bypass pages without admin layout
  if (isBypassPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAdmin) {
    return null;
  }

  const roleLabel = (teamRole in ADMIN_ROLE_LABELS)
    ? ADMIN_ROLE_LABELS[teamRole as AdminRole]
    : teamRole;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Bharat Bhoomi-99</h1>
          <p className="text-xs text-brand-primary font-medium">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <HomeIcon className="h-5 w-5" />
            Back to Site
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-brand-primary">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin'}
              </p>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-400" />
                <p className="text-xs text-gray-500 truncate">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

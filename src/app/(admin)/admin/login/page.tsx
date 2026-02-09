'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui';
import { Lock, Mail } from 'lucide-react';

const ADMIN_EMAIL = 'admin@bharatbhoomi99.com';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already admin, redirect
  if (isAuthenticated && user?.role === 'admin') {
    router.push(ROUTES.ADMIN);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate async
    await new Promise((r) => setTimeout(r, 500));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set admin user in localStorage directly
      const adminUser = {
        id: 999,
        email: ADMIN_EMAIL,
        name: 'Admin',
        firstName: 'Admin',
        lastName: null,
        phone: null,
        role: 'admin' as const,
        isVerified: true,
        isAgent: false,
        agencyId: null,
        agencyName: null,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('bharatbhoomi_user', JSON.stringify(adminUser));
      localStorage.setItem('bharatbhoomi_last_login', new Date().toISOString());
      localStorage.setItem('bharatbhoomi_is_guest', 'false');

      // Force page reload to pick up new auth state
      window.location.href = ROUTES.ADMIN;
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
            <Lock className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-500">Sign in to access the admin panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bharatbhoomi99.com"
                  className="w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

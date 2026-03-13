'use client';

import { useState, useEffect } from 'react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui';
import { Lock, Mail, Shield, Key } from 'lucide-react';
import { teamService } from '@/lib/api/services/team.service';

const inputClass =
  'w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all';

type Mode = 'checking' | 'setup' | 'login';

function storeAdminUser(data: {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  teamRole: string;
  teamMemberId: number;
}): void {
  const adminUser = {
    id: data.id,
    email: data.email,
    name: `${data.firstName} ${data.lastName || ''}`.trim(),
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'admin' as const,
    isVerified: true,
    isAgent: false,
    agencyId: null,
    agencyName: null,
    createdAt: new Date().toISOString(),
    teamRole: data.teamRole,
    teamMemberId: data.teamMemberId,
  };
  localStorage.setItem('bharatbhoomi_user', JSON.stringify(adminUser));
  localStorage.setItem('bharatbhoomi_last_login', new Date().toISOString());
  localStorage.setItem('bharatbhoomi_is_guest', 'false');
}

export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    teamService.getTeamStatus()
      .then((status) => {
        if (!cancelled) setMode(status.hasTeamMembers ? 'login' : 'setup');
      })
      .catch(() => {
        if (!cancelled) setMode('setup');
      });
    return () => { cancelled = true; };
  }, []);

  // First-time setup: admin key + email + password → bootstrap in one step
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Validate admin key (creates session cookie for bootstrap call)
      const keyRes = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminKey }),
      });
      if (!keyRes.ok) {
        setError('Invalid admin key');
        setIsLoading(false);
        return;
      }

      // Step 2: Login to get userId
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      const userId = loginData.model?.userId;
      const userInfo = loginData.model;

      if (!userId) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Step 3: Bootstrap — link this user as super_admin
      const bootstrapResult = await teamService.bootstrap(userId);

      storeAdminUser({
        id: userId,
        email: userInfo.email || email,
        firstName: userInfo.firstName || 'Admin',
        lastName: userInfo.lastName || null,
        phone: userInfo.phone || null,
        teamRole: bootstrapResult.role || 'super_admin',
        teamMemberId: bootstrapResult.teamMemberId,
      });

      window.location.href = ROUTES.ADMIN;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
      setIsLoading(false);
    }
  };

  // Normal team member login: email + password only
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await teamService.login(email, password);

      storeAdminUser({
        id: result.userId,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        phone: result.phone,
        teamRole: result.role,
        teamMemberId: result.teamMemberId,
      });

      window.location.href = ROUTES.ADMIN;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  if (mode === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-brand-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isSetup = mode === 'setup';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSetup ? 'Admin Setup' : 'Admin Login'}
          </h1>
          <p className="text-gray-500">
            {isSetup
              ? 'Set up your admin account to get started'
              : 'Sign in with your admin credentials'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={isSetup ? handleSetup : handleLogin} className="space-y-5">
            {/* Admin key — only shown during first-time setup */}
            {isSetup && (
              <div>
                <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Admin Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="adminKey"
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter your admin key"
                    className={inputClass}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  One-time setup key provided by your developer
                </p>
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
                  placeholder="your@email.com"
                  className={inputClass}
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
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={isLoading}>
              {isSetup ? 'Set Up Admin' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

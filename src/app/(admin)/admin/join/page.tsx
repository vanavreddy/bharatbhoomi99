'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui';
import { teamService } from '@/lib/api/services/team.service';
import { ADMIN_ROLE_LABELS, isAdminRole } from '@/types';
import {
  Shield, Mail, Lock, User, Phone,
  AlertCircle, CheckCircle, UserPlus, LogIn,
} from 'lucide-react';

type PageState = 'loading' | 'invalid' | 'valid';
type Tab = 'login' | 'signup';

interface InviteInfo {
  role: string;
  phone: string;
  expiresAt: string;
}

export default function JoinPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [pageState, setPageState] = useState<PageState>('loading');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate token on load
  useEffect(() => {
    if (!token) {
      setErrorMsg('No invite token provided. Please use the invite link shared with you.');
      setPageState('invalid');
      return;
    }

    let isMounted = true;
    teamService.validateInvite(token)
      .then((info) => {
        if (!isMounted) return;
        setInviteInfo(info);
        setPhone(info.phone || '');
        setPageState('valid');
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg(err instanceof Error ? err.message : 'This invite link is invalid or has expired.');
        setPageState('invalid');
      });
    return () => { isMounted = false; };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const isNewUser = tab === 'signup';
      const payload = {
        isNewUser,
        email,
        password,
        ...(isNewUser && {
          firstName,
          lastName: lastName || undefined,
          phone: phone || undefined,
        }),
      };

      const result = await teamService.acceptInvite(token, payload);

      // Store user in localStorage
      const adminUser = {
        id: result.userId,
        email,
        name: isNewUser ? `${firstName} ${lastName || ''}`.trim() : email,
        firstName: isNewUser ? firstName : email.split('@')[0],
        lastName: isNewUser ? lastName : null,
        phone: isNewUser ? phone : null,
        role: 'admin' as const,
        isVerified: true,
        isAgent: false,
        agencyId: null,
        agencyName: null,
        createdAt: new Date().toISOString(),
        teamRole: result.role,
        teamMemberId: result.teamMemberId,
      };

      localStorage.setItem('bharatbhoomi_user', JSON.stringify(adminUser));
      localStorage.setItem('bharatbhoomi_last_login', new Date().toISOString());
      localStorage.setItem('bharatbhoomi_is_guest', 'false');

      window.location.href = ROUTES.ADMIN;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to accept invite. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Loading
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Validating invite...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (pageState === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h1>
          <p className="text-gray-500 mb-6">{errorMsg}</p>
          <a
            href={ROUTES.HOME}
            className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    );
  }

  const inviteRole = inviteInfo?.role || 'viewer';
  const roleLabel = isAdminRole(inviteRole) ? ADMIN_ROLE_LABELS[inviteRole] : inviteRole;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Admin Team</h1>
          <p className="text-gray-500">
            You&apos;ve been invited as <span className="font-semibold text-gray-700">{roleLabel}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Invite Info */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2 mb-6">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            Invite verified. Complete your account to get started.
          </div>

          {formError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LogIn className="h-4 w-4" />
              I have an account
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Signup-only fields */}
            {tab === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full h-11 pl-10 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full h-11 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 pl-10 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Common fields */}
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
                  placeholder={tab === 'signup' ? 'Create a password' : 'Enter your password'}
                  className="w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              isLoading={isSubmitting}
              disabled={!email || !password || (tab === 'signup' && !firstName)}
            >
              {tab === 'login' ? 'Sign In & Join Team' : 'Create Account & Join Team'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

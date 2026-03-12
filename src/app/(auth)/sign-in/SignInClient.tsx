'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  User,
} from 'lucide-react';

const isValidEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

export default function SignInClient() {
  const router = useRouter();
  const {
    signInWithEmail,
    loginAsGuest,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, router]);

  // Clear errors on input change
  useEffect(() => {
    setLocalError(null);
    clearError();
  }, [email, password, clearError]);

  // Handle email/password submission
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      // Successfully logged in - redirect handled by auth context
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      if (message.includes('not found')) {
        router.push(`${ROUTES.SIGN_UP}?email=${encodeURIComponent(email)}`);
      } else {
        setLocalError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, signInWithEmail, router]);

  // Handle guest login
  const handleGuestLogin = useCallback(() => {
    loginAsGuest();
    router.push(ROUTES.HOME);
  }, [loginAsGuest, router]);

  const error = localError || authError;
  const isLoading = isSubmitting || authLoading;

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="w-full max-w-md flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card padding="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in with your email and password
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            leftIcon={<Mail className="h-5 w-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            leftIcon={<Lock className="h-5 w-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isLoading}
            rightIcon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={handleGuestLogin}
            leftIcon={<User className="h-5 w-5" />}
          >
            Continue as Guest
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.SIGN_UP} className="text-brand-primary font-medium hover:underline">
            Sign up for free
          </Link>
        </p>
      </Card>
    </div>
  );
}

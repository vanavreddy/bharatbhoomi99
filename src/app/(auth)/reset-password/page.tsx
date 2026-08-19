'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/constants/routes';
import { KeyRound, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Checked here as well as on the server so the mismatch is caught before a
    // round trip, not because the client is trusted.
    if (password !== confirm) {
      setError('The two passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.apiErrors?.[0] ?? 'Could not reset your password.');
        return;
      }
      setDone(true);
      setTimeout(() => router.push(ROUTES.SIGN_IN), 2500);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link not valid</h1>
        <p className="text-gray-600 mb-6">
          This reset link is missing its token. Request a new one.
        </p>
        <Link href={ROUTES.FORGOT_PASSWORD} className="text-brand-primary hover:text-brand-primary-dark">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-md text-center">
        <CheckCircle className="h-12 w-12 text-semantic-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password updated</h1>
        <p className="text-gray-600">Taking you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
          <KeyRound className="h-7 w-7 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set a new password</h1>
        <p className="text-gray-500">Choose something you haven&apos;t used before.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="p-3 bg-semantic-error-light border border-semantic-error/30 rounded-lg text-sm text-semantic-error">
            {error}
          </div>
        )}

        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!password || !confirm}>
          Update password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<div className="w-full max-w-md text-center text-gray-500">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

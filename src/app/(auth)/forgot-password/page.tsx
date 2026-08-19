'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/constants/routes';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.apiErrors?.[0] ?? 'Could not send the reset link. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * The success screen deliberately does not say whether the address is
   * registered. Confirming it would turn this form into a way to discover who
   * has an account.
   */
  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <CheckCircle className="h-12 w-12 text-semantic-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
        <p className="text-gray-600 mb-6">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset
          your password. It expires in one hour.
        </p>
        <Link href={ROUTES.SIGN_IN} className="text-brand-primary hover:text-brand-primary-dark">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
          <Mail className="h-7 w-7 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
        <p className="text-gray-500">We&apos;ll email you a link to set a new one.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="p-3 bg-semantic-error-light border border-semantic-error/30 rounded-lg text-sm text-semantic-error">
            {error}
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!email}>
          Send reset link
        </Button>
      </form>

      <Link
        href={ROUTES.SIGN_IN}
        className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}

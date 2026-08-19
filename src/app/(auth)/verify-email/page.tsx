'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type State = 'verifying' | 'verified' | 'failed';

function VerifyEmail() {
  const token = useSearchParams().get('token') ?? '';
  const [state, setState] = useState<State>('verifying');
  const [message, setMessage] = useState('');

  // Tokens are single-use, so this must fire exactly once. React 18 Strict
  // Mode runs effects twice in development; without the guard the second call
  // consumes the token the first one just spent and reports failure.
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (!token) {
      setState('failed');
      setMessage('This verification link is missing its token.');
      return;
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setState('verified');
        } else {
          setState('failed');
          setMessage(data.apiErrors?.[0] ?? 'This link is invalid or has expired.');
        }
      })
      .catch(() => {
        setState('failed');
        setMessage('Could not reach the server. Please try again.');
      });
  }, [token]);

  if (state === 'verifying') {
    return (
      <div className="w-full max-w-md text-center">
        <Loader2 className="h-10 w-10 text-brand-primary mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Verifying your email…</p>
      </div>
    );
  }

  if (state === 'verified') {
    return (
      <div className="w-full max-w-md text-center">
        <CheckCircle className="h-12 w-12 text-semantic-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified</h1>
        <p className="text-gray-600 mb-6">Your address is confirmed. Thanks.</p>
        <Link href={ROUTES.PROFILE} className="text-brand-primary hover:text-brand-primary-dark">
          Go to your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-center">
      <XCircle className="h-12 w-12 text-semantic-error mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Could not verify</h1>
      <p className="text-gray-600 mb-6">{message}</p>
      <Link href={ROUTES.PROFILE} className="text-brand-primary hover:text-brand-primary-dark">
        Request a new link from your profile
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md text-center text-gray-500">Loading…</div>}>
      <VerifyEmail />
    </Suspense>
  );
}

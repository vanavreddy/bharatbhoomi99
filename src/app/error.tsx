'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container size="sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-semantic-error/10 mb-6">
            <span className="text-4xl">!</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We apologize for the inconvenience. An unexpected error has occurred.
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button leftIcon={<RefreshCw className="h-5 w-5" />} onClick={reset}>
              Try Again
            </Button>
            <Button variant="outline" leftIcon={<Home className="h-5 w-5" />} asChild>
              <a href="/">Go Home</a>
            </Button>
          </div>
          {error.digest && (
            <p className="mt-8 text-xs text-gray-400">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

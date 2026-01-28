import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Input, Checkbox, Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/constants/seo';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: PAGE_TITLES.signUp,
  description: PAGE_DESCRIPTIONS.signUp,
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <Card padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join Bharat Bhoomi-99 to find or list properties
          </p>
        </div>

        <form className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            placeholder="Your full name"
            leftIcon={<User className="h-5 w-5" />}
            required
            autoComplete="name"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            leftIcon={<Mail className="h-5 w-5" />}
            required
            autoComplete="email"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="10-digit mobile number"
            leftIcon={<Phone className="h-5 w-5" />}
            required
            autoComplete="tel"
            hint="We'll send a verification code"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            leftIcon={<Lock className="h-5 w-5" />}
            required
            autoComplete="new-password"
            hint="Min 8 characters with uppercase, lowercase, number, and symbol"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            leftIcon={<Lock className="h-5 w-5" />}
            required
            autoComplete="new-password"
          />

          <Checkbox
            name="acceptTerms"
            label={
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-brand-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
            required
          />

          <Button type="submit" fullWidth size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
            Create Account
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" fullWidth type="button">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" fullWidth type="button">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link href={ROUTES.SIGN_IN} className="text-brand-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

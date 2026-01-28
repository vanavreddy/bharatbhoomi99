'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
} from 'lucide-react';

type AuthStep = 'phone' | 'otp' | 'email';

// Validation helpers
const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

const isValidEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

export default function SignInPage() {
  const router = useRouter();
  const {
    generateOTP,
    validateOTP,
    signInWithEmail,
    loginAsGuest,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    otpState,
    clearError,
  } = useAuth();

  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // OTP input refs
  const otpRef0 = useRef<HTMLInputElement>(null);
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRefs = useMemo(() => [otpRef0, otpRef1, otpRef2, otpRef3], []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, router]);

  // Clear errors when switching steps
  useEffect(() => {
    setLocalError(null);
    clearError();
  }, [step, clearError]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === 'otp') {
      otpRef0.current?.focus();
    }
  }, [step]);

  // Handle phone submission
  const handlePhoneSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isValidPhone(phone)) {
      setLocalError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      await generateOTP(phone);
      setStep('otp');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  }, [phone, generateOTP]);

  // Handle OTP input change
  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 3) {
      const nextRef = otpRefs[index + 1];
      nextRef?.current?.focus();
    }
  }, [otp, otpRefs]);

  // Handle OTP backspace
  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevRef = otpRefs[index - 1];
      prevRef?.current?.focus();
    }
  }, [otp, otpRefs]);

  // Handle OTP submission
  const handleOtpSubmit = useCallback(async (otpValue?: string) => {
    const otpCode = otpValue || otp.join('');
    setLocalError(null);

    if (otpCode.length !== 4) {
      setLocalError('Please enter a valid 4-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await validateOTP(phone, otpCode);

      // If userId is 0, user needs to register
      if (response.mobileUser && response.mobileUser.userId === 0) {
        router.push(`${ROUTES.SIGN_UP}?phone=${encodeURIComponent(phone)}`);
        return;
      }

      // Successfully logged in - redirect handled by auth context
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid OTP');
      setOtp(['', '', '', '']);
      otpRef0.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [otp, phone, validateOTP, router]);

  // Handle email/password submission
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (password.length < 3) {
      setLocalError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      // Successfully logged in - redirect handled by auth context
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      if (message.includes('not found')) {
        // User doesn't exist, redirect to signup
        router.push(`${ROUTES.SIGN_UP}?email=${encodeURIComponent(email)}`);
      } else {
        setLocalError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, signInWithEmail, router]);

  // Resend OTP
  const handleResendOtp = useCallback(async () => {
    if (otpState.resendCount >= 3) {
      setLocalError('Maximum resend attempts reached. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    try {
      await generateOTP(phone);
      setOtp(['', '', '', '']);
      otpRef0.current?.focus();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  }, [phone, generateOTP, otpState.resendCount]);

  // Handle guest login
  const handleGuestLogin = useCallback(() => {
    loginAsGuest();
    router.push(ROUTES.HOME);
  }, [loginAsGuest, router]);

  const error = localError || authError || otpState.error;
  const isLoading = isSubmitting || authLoading || otpState.isLoading;

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
            {step === 'phone' && 'Welcome Back'}
            {step === 'otp' && 'Enter OTP'}
            {step === 'email' && 'Sign In with Email'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone' && 'Sign in with your phone number'}
            {step === 'otp' && `We sent a code to +91 ${phone}`}
            {step === 'email' && 'Enter your email and password'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Phone Step */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              leftIcon={<Phone className="h-5 w-5" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              autoComplete="tel"
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
              rightIcon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            >
              {isLoading ? 'Sending OTP...' : 'Get OTP'}
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
              variant="outline"
              fullWidth
              onClick={() => setStep('email')}
              leftIcon={<Mail className="h-5 w-5" />}
            >
              Sign in with Email
            </Button>

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
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp(['', '', '', '']);
              }}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Change phone number
            </button>

            {/* OTP inputs */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:bg-gray-50"
                />
              ))}
            </div>

            {/* Verify button */}
            <Button
              type="button"
              fullWidth
              size="lg"
              onClick={() => handleOtpSubmit()}
              disabled={isLoading || otp.some(d => !d)}
              rightIcon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading || otpState.resendCount >= 3}
                className="text-sm font-medium text-brand-primary hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {otpState.resendCount >= 3 ? 'Max attempts reached' : 'Resend OTP'}
              </button>
              {otpState.resendCount > 0 && otpState.resendCount < 3 && (
                <span className="text-xs text-gray-500 block mt-1">
                  ({3 - otpState.resendCount} attempts remaining)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Sign in with phone
            </button>

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
          </form>
        )}

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link href={ROUTES.SIGN_UP} className="text-brand-primary font-medium hover:underline">
            Sign up for free
          </Link>
        </p>
      </Card>
    </div>
  );
}

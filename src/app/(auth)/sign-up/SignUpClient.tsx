'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Checkbox, Card } from '@/components/ui';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

// Password validation rules matching React Native app
const PASSWORD_RULES = {
  minLength: 6,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
};

// Validation helpers
const isValidEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
  }
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter');
  }
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter');
  }
  if (PASSWORD_RULES.requireDigit && !/\d/.test(password)) {
    errors.push('At least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export default function SignUpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    signUp,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();

  // Pre-fill from URL params (from sign-in redirect)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, router]);

  // Clear errors when form changes
  useEffect(() => {
    setLocalError(null);
    clearError();
  }, [formData, clearError]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error on change
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [formErrors]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      errors.password = `Password must have: ${passwordValidation.errors.join(', ')}`;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage('Account created successfully! Redirecting...');
      // Redirect is handled by auth context
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, signUp]);

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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join Bharat Bhoomi-99 to find or list properties
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="First name"
              leftIcon={<User className="h-5 w-5" />}
              value={formData.firstName}
              onChange={handleChange}
              error={formErrors.firstName}
              disabled={isLoading}
              autoComplete="given-name"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              error={formErrors.lastName}
              disabled={isLoading}
              autoComplete="family-name"
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            leftIcon={<Mail className="h-5 w-5" />}
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            disabled={isLoading}
            autoComplete="email"
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="10-digit mobile number"
            leftIcon={<Phone className="h-5 w-5" />}
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
            disabled={isLoading}
            autoComplete="tel"
            hint="We'll send a verification code"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              leftIcon={<Lock className="h-5 w-5" />}
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              disabled={isLoading}
              autoComplete="new-password"
              hint="Min 6 characters with uppercase, lowercase, and number"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              leftIcon={<Lock className="h-5 w-5" />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div>
            <Checkbox
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={isLoading}
              label={
                <span className="text-sm">
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
            />
            {formErrors.acceptTerms && (
              <p className="text-sm text-red-500 mt-1">{formErrors.acceptTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isLoading}
            rightIcon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

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

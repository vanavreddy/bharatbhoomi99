'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/contexts';
import { Lock, UserPlus, LogIn, X } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestContinue?: () => void;
}

export function LoginPromptModal({ isOpen, onClose, onGuestContinue }: LoginPromptModalProps) {
  const router = useRouter();
  const { loginAsGuest } = useAuth();

  if (!isOpen) return null;

  const handleGuestContinue = () => {
    loginAsGuest();
    onClose();
    onGuestContinue?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
          <Lock className="h-8 w-8 text-brand-primary" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sign in to Continue
          </h2>
          <p className="text-sm text-gray-500">
            Create an account or sign in to view property details and contact owners.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            fullWidth
            size="lg"
            className="rounded-xl"
            leftIcon={<UserPlus className="h-5 w-5" />}
            onClick={() => { onClose(); router.push(ROUTES.SIGN_UP); }}
          >
            Sign Up
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="outline"
            className="rounded-xl"
            leftIcon={<LogIn className="h-5 w-5" />}
            onClick={() => { onClose(); router.push(ROUTES.SIGN_IN); }}
          >
            Login
          </Button>

          <button
            type="button"
            onClick={handleGuestContinue}
            className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

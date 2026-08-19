'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui';
import { userService, type UserProfile } from '@/lib/api/services/user.service';
import {
  User, Mail, Phone, Lock, Camera,
  Check, AlertCircle, Shield, Calendar,
  Eye, EyeOff,
} from 'lucide-react';

const inputClass =
  'w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all';

export default function ProfilePage() {
  const { user, isAuthenticated, isGuest, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Email verification
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSendVerification = async () => {
    setError('');
    setIsSendingVerification(true);
    try {
      const res = await fetch('/api/auth/send-verification', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.apiErrors?.[0] ?? 'Could not send the verification email.');
        return;
      }
      // Latched rather than reset on a timer: issuing a second token would
      // invalidate the link the first one just sent.
      setVerificationSent(true);
      setSuccessMsg('Verification email sent — check your inbox.');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSendingVerification(false);
    }
  };
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Avatar
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-clear success messages
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(''), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  useEffect(() => {
    if (!passwordSuccess) return;
    const t = setTimeout(() => setPasswordSuccess(''), 4000);
    return () => clearTimeout(t);
  }, [passwordSuccess]);

  // Auth gate
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || isGuest)) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [authLoading, isAuthenticated, isGuest, router]);

  // Fetch profile
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    userService.getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName || '');
        setPhone(data.phone || '');
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [user?.id]);

  const handleSaveProfile = async () => {
    if (!user?.id || !firstName.trim()) return;
    setIsSavingProfile(true);
    setError('');

    try {
      const updated = await userService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      setProfile(updated);
      setSuccessMsg('Profile updated successfully');

      // Update localStorage so the header reflects changes
      try {
        const stored = localStorage.getItem('bharatbhoomi_user');
        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, unknown>;
          parsed.firstName = updated.firstName;
          parsed.lastName = updated.lastName;
          parsed.name = `${updated.firstName} ${updated.lastName || ''}`.trim();
          parsed.phone = updated.phone;
          localStorage.setItem('bharatbhoomi_user', JSON.stringify(parsed));
        }
      } catch { /* non-fatal — header will sync on next page load */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!user?.id) return;
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsSavingPassword(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setError('');
    try {
      const result = await userService.uploadAvatar(file);
      setProfile((prev) => prev ? { ...prev, avatarUrl: result.avatarUrl } : prev);
      setSuccessMsg('Avatar updated');

      // Update localStorage
      try {
        const stored = localStorage.getItem('bharatbhoomi_user');
        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, unknown>;
          parsed.avatar = result.avatarUrl;
          localStorage.setItem('bharatbhoomi_user', JSON.stringify(parsed));
        }
      } catch { /* non-fatal — header will sync on next page load */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
          <Check className="h-4 w-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Avatar + Account Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-brand-primary">
                  {profile?.firstName?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Camera className="h-4 w-4 text-gray-500" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {profile?.firstName} {profile?.lastName || ''}
            </p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="h-3 w-3" />
                {profile?.isVerified ? 'Verified' : 'Unverified'}
              </div>
              {profile && !profile.isVerified && (
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={isSendingVerification || verificationSent}
                  className="text-xs font-medium text-brand-primary hover:text-brand-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {verificationSent
                    ? 'Verification email sent'
                    : isSendingVerification
                      ? 'Sending…'
                      : 'Verify now'}
                </button>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        </div>

        {isUploadingAvatar && (
          <div className="mb-4 p-2 bg-blue-50 rounded-lg text-xs text-blue-600 text-center">
            Uploading avatar...
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="First name"
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
                className={inputClass}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            isLoading={isSavingProfile}
            disabled={!firstName.trim()}
            className="rounded-xl"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Change Password</h2>

        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
            <Check className="h-4 w-4 flex-shrink-0" />
            {passwordSuccess}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="currentPassword"
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="newPassword"
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            isLoading={isSavingPassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            variant="outline"
            className="rounded-xl"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

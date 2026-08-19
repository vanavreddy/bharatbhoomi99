/**
 * User Service — profile management via internal Next.js proxy routes
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse } from '../bb-types';

export interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface AvatarUploadResponse {
  success: boolean;
  data: { avatarUrl: string };
  error?: { code: string; message: string };
}

// The session cookie travels automatically on a same-origin fetch, so these
// requests need nothing beyond the content type.
const userHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
});

class UserService {
  async getProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      headers: userHeaders(),
    });
    const data: BBApiResponse<UserProfile> = await res.json();
    return unwrapBBResponse(data);
  }

  async updateProfile(
    updates: { firstName?: string; lastName?: string; phone?: string }
  ): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: userHeaders(),
      body: JSON.stringify(updates),
    });
    const data: BBApiResponse<UserProfile> = await res.json();
    return unwrapBBResponse(data);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: userHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data: BBApiResponse<{ message: string }> = await res.json();
    return unwrapBBResponse(data);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });
    const data: AvatarUploadResponse = await res.json();
    if (!data.success) {
      throw new Error(data.error?.message ?? 'Avatar upload failed');
    }
    return data.data;
  }
}

export const userService = new UserService();

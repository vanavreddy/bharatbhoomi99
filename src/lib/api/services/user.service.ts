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

const userHeaders = (userId: number): Record<string, string> => ({
  'Content-Type': 'application/json',
  'X-BB-User-Id': String(userId),
});

class UserService {
  async getProfile(userId: number): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      headers: userHeaders(userId),
    });
    const data: BBApiResponse<UserProfile> = await res.json();
    return unwrapBBResponse(data);
  }

  async updateProfile(
    userId: number,
    updates: { firstName?: string; lastName?: string; phone?: string }
  ): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: userHeaders(userId),
      body: JSON.stringify(updates),
    });
    const data: BBApiResponse<UserProfile> = await res.json();
    return unwrapBBResponse(data);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: userHeaders(userId),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data: BBApiResponse<{ message: string }> = await res.json();
    return unwrapBBResponse(data);
  }

  async uploadAvatar(userId: number, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/user/avatar', {
      method: 'POST',
      headers: { 'X-BB-User-Id': String(userId) },
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

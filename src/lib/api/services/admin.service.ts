/**
 * Admin Service — admin operations via internal Next.js proxy routes
 * Called from client-side admin pages, so uses relative URLs.
 * The proxy routes inject the real BB_ADMIN_KEY from env when forwarding to the backend.
 */

import { unwrapBBResponse } from '../bb-response';
import type {
  BBApiResponse,
  ExternalBBAdminProperty,
  ExternalBBAnalytics,
  ExternalBBContactEnquiry,
  BBCreateBuilderRequest,
  BBUpdateBuilderRequest,
  BBApprovePropertyRequest,
  BBRejectPropertyRequest,
  BBUpdateContactStatusRequest,
} from '../bb-types';
import type { AdminProperty, AdminAnalytics, ContactEnquiry } from '@/types';

// Cookie-based auth — bb_admin_session cookie is sent automatically (same-origin, Path=/api/admin)
const adminHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

class AdminService {
  // Properties
  async getProperties(status?: string): Promise<AdminProperty[]> {
    const qs = status ? `?status=${status}` : '';
    const res = await fetch(`/api/admin/properties${qs}`, {
      headers: adminHeaders,
    });
    const data: BBApiResponse<ExternalBBAdminProperty[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async getPropertyDetail(id: number): Promise<AdminProperty> {
    const res = await fetch(`/api/admin/properties/${id}`, {
      headers: adminHeaders,
    });
    const data: BBApiResponse<ExternalBBAdminProperty> = await res.json();
    return unwrapBBResponse(data);
  }

  async approveProperty(id: number, adminUserId: number): Promise<void> {
    const body: BBApprovePropertyRequest = { adminUserId };
    const res = await fetch(`/api/admin/properties/${id}/approve`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }

  async rejectProperty(id: number, reason: string, adminUserId: number): Promise<void> {
    const body: BBRejectPropertyRequest = { rejectionReason: reason, adminUserId };
    const res = await fetch(`/api/admin/properties/${id}/reject`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }

  // Analytics
  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await fetch('/api/admin/analytics', {
      headers: adminHeaders,
    });
    const data: BBApiResponse<ExternalBBAnalytics> = await res.json();
    return unwrapBBResponse(data);
  }

  // Contact Enquiries
  async getContactEnquiries(): Promise<ContactEnquiry[]> {
    const res = await fetch('/api/admin/contact-enquiries', {
      headers: adminHeaders,
    });
    const data: BBApiResponse<ExternalBBContactEnquiry[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async updateContactStatus(id: number, status: string): Promise<void> {
    const body: BBUpdateContactStatusRequest = { status };
    const res = await fetch(`/api/admin/contact-enquiries/${id}/status`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }

  // Builders
  async createBuilder(builderData: BBCreateBuilderRequest): Promise<void> {
    const res = await fetch('/api/admin/builders', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify(builderData),
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }

  async updateBuilder(id: string, builderData: BBUpdateBuilderRequest): Promise<void> {
    const res = await fetch(`/api/admin/builders/${id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(builderData),
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }

  async deleteBuilder(id: string): Promise<void> {
    const res = await fetch(`/api/admin/builders/${id}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }
}

export const adminService = new AdminService();

/**
 * Team Service — admin team management operations via internal Next.js proxy routes
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse } from '../bb-types';
import type { TeamMember, AdminInvite, TeamStatus } from '@/types';

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

class TeamService {
  async getTeamStatus(): Promise<TeamStatus> {
    const res = await fetch('/api/admin/team/status', { headers });
    const data: BBApiResponse<TeamStatus> = await res.json();
    return unwrapBBResponse(data);
  }

  async bootstrap(userId: number): Promise<{ teamMemberId: number; role: string }> {
    const res = await fetch('/api/admin/team/bootstrap', {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId }),
    });
    const data: BBApiResponse<{ teamMemberId: number; role: string }> = await res.json();
    return unwrapBBResponse(data);
  }

  async login(email: string, password: string): Promise<{
    userId: number;
    teamMemberId: number;
    role: string;
    firstName: string;
    lastName: string | null;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  }> {
    const res = await fetch('/api/admin/team/login', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return unwrapBBResponse(data);
  }

  async getMembers(): Promise<TeamMember[]> {
    const res = await fetch('/api/admin/team/members', { headers });
    const data: BBApiResponse<TeamMember[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async updateMemberRole(teamMemberId: number, role: string): Promise<void> {
    const res = await fetch(`/api/admin/team/members/${teamMemberId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    unwrapBBResponse(data);
  }

  async updateMemberStatus(teamMemberId: number, status: string): Promise<void> {
    const res = await fetch(`/api/admin/team/members/${teamMemberId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    unwrapBBResponse(data);
  }

  async createInvite(phone: string, role: string): Promise<{ inviteId: number; token: string; expiresAt: string }> {
    const res = await fetch('/api/admin/team/invites', {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone, role }),
    });
    const data = await res.json();
    return unwrapBBResponse(data);
  }

  async getPendingInvites(): Promise<AdminInvite[]> {
    const res = await fetch('/api/admin/team/invites', { headers });
    const data: BBApiResponse<AdminInvite[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async validateInvite(token: string): Promise<{ role: string; phone: string; expiresAt: string }> {
    const res = await fetch(`/api/admin/team/invites/${token}/validate`, { headers });
    const data = await res.json();
    return unwrapBBResponse(data);
  }

  async acceptInvite(
    token: string,
    payload: {
      isNewUser: boolean;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    }
  ): Promise<{ userId: number; teamMemberId: number; role: string }> {
    const res = await fetch(`/api/admin/team/invites/${token}/accept`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return unwrapBBResponse(data);
  }

  async revokeInvite(inviteId: number): Promise<void> {
    const res = await fetch(`/api/admin/team/invites/${inviteId}/revoke`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    unwrapBBResponse(data);
  }
}

export const teamService = new TeamService();

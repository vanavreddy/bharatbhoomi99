'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Badge } from '@/components/ui';
import { teamService } from '@/lib/api/services/team.service';
import { ADMIN_ROLE_LABELS, isAdminRole, type AdminRole, type TeamMember, type AdminInvite } from '@/types';
import {
  UserPlus, Clock, X, Copy,
  Check, Trash2, MessageCircle,
} from 'lucide-react';

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: 'property_manager', label: 'Property Manager' },
  { value: 'content_manager', label: 'Content Manager' },
  { value: 'viewer', label: 'Viewer' },
];

const ROLE_BADGE_COLORS: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  super_admin: 'error',
  property_manager: 'success',
  content_manager: 'warning',
  viewer: 'default',
};

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('viewer');
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Role change modal
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [membersData, invitesData] = await Promise.all([
        teamService.getMembers(),
        teamService.getPendingInvites(),
      ]);
      setMembers(membersData);
      setInvites(invitesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateInvite = async () => {
    if (!invitePhone.trim()) return;
    setInviteLoading(true);
    try {
      const result = await teamService.createInvite(invitePhone.trim(), inviteRole);
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/admin/join?token=${result.token}`);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopied(true);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => setError('Could not copy to clipboard'));
  };

  const handleWhatsAppShare = () => {
    const text = `Join the BB Admin Team: ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleChangeRole = async () => {
    if (!editingMember || !newRole) return;
    setIsRoleUpdating(true);
    try {
      await teamService.updateMemberRole(editingMember.teamMemberId, newRole);
      setEditingMember(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsRoleUpdating(false);
    }
  };

  const handleUpdateStatus = async (member: TeamMember, status: string) => {
    const confirmMsg = status === 'removed'
      ? `Remove ${member.firstName} from the team?`
      : status === 'suspended'
        ? `Suspend ${member.firstName}?`
        : `Reactivate ${member.firstName}?`;
    if (!confirm(confirmMsg)) return;
    setStatusUpdatingId(member.teamMemberId);
    try {
      await teamService.updateMemberStatus(member.teamMemberId, status);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleRevokeInvite = async (inviteId: number) => {
    if (!confirm('Revoke this invite?')) return;
    try {
      await teamService.revokeInvite(inviteId);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke invite');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">{members.length} team member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => { setShowInviteModal(true); setInviteLink(''); setInvitePhone(''); setCopied(false); }}
        >
          Invite Member
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Member</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Joined</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.teamMemberId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-brand-primary">
                          {member.firstName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName || ''}
                        </p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                        {member.phone && <p className="text-xs text-gray-400">{member.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ROLE_BADGE_COLORS[member.role] || 'default'} size="sm">
                      {isAdminRole(member.role) ? ADMIN_ROLE_LABELS[member.role] : member.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={member.status === 'active' ? 'success' : member.status === 'suspended' ? 'warning' : 'error'}
                      size="sm"
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.role !== 'super_admin' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={statusUpdatingId === member.teamMemberId}
                          onClick={() => { setEditingMember(member); setNewRole(member.role); }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                        >
                          Change Role
                        </button>
                        {member.status === 'active' ? (
                          <button
                            disabled={statusUpdatingId === member.teamMemberId}
                            onClick={() => handleUpdateStatus(member, 'suspended')}
                            className="text-xs text-amber-600 hover:text-amber-800 font-medium disabled:opacity-50"
                          >
                            {statusUpdatingId === member.teamMemberId ? 'Updating...' : 'Suspend'}
                          </button>
                        ) : member.status === 'suspended' ? (
                          <button
                            disabled={statusUpdatingId === member.teamMemberId}
                            onClick={() => handleUpdateStatus(member, 'active')}
                            className="text-xs text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                          >
                            {statusUpdatingId === member.teamMemberId ? 'Updating...' : 'Reactivate'}
                          </button>
                        ) : null}
                        <button
                          disabled={statusUpdatingId === member.teamMemberId}
                          onClick={() => handleUpdateStatus(member, 'removed')}
                          className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              Pending Invites ({invites.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {invites.map((invite) => (
              <div key={invite.inviteId} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-900">{invite.phone}</span>
                  <Badge variant={ROLE_BADGE_COLORS[invite.role] || 'default'} size="sm">
                    {isAdminRole(invite.role) ? ADMIN_ROLE_LABELS[invite.role] : invite.role}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRevokeInvite(invite.inviteId)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!inviteLink ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => { if (isAdminRole(e.target.value)) setInviteRole(e.target.value); }}
                    className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
                  >
                    {ROLE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <Button
                  className="w-full rounded-xl"
                  onClick={handleCreateInvite}
                  isLoading={inviteLoading}
                  disabled={!invitePhone.trim()}
                >
                  Generate Invite Link
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Invite created! Share the link below.
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 break-all font-mono">
                  {inviteLink}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    onClick={handleCopyLink}
                  >
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                  <Button
                    className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                    leftIcon={<MessageCircle className="h-4 w-4" />}
                    onClick={handleWhatsAppShare}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Change Role for {editingMember.firstName}
            </h2>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all mb-4"
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingMember(null)} disabled={isRoleUpdating}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-xl" onClick={handleChangeRole} disabled={isRoleUpdating}>
                {isRoleUpdating ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

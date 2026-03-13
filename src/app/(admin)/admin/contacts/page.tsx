'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/lib/api/services/admin.service';
import { Card, Badge, Button } from '@/components/ui';
import type { ContactEnquiry } from '@/types';
import { useToast } from '@/contexts';
import { RefreshCw, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

const STATUS_OPTIONS = ['new', 'in-progress', 'resolved'] as const;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getContactEnquiries();
      setContacts(data);
    } catch {
      setError('Failed to load contact enquiries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await adminService.updateContactStatus(id, newStatus);
      showToast(`Status updated to ${newStatus}`);
      fetchContacts();
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return <Badge variant="success" size="sm">Resolved</Badge>;
      case 'in-progress': return <Badge variant="warning" size="sm">In Progress</Badge>;
      default: return <Badge variant="primary" size="sm">New</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
          <p className="text-gray-500 mt-1">{contacts.length} submissions</p>
        </div>
        <Button variant="outline" onClick={fetchContacts} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Email</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Subject</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Date</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No contact submissions yet</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.contactId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        {c.phone && <p className="text-xs text-gray-500">{c.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium truncate max-w-[200px]">{c.subject}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.message}</p>
                    </td>
                    <td className="px-6 py-4">{statusBadge(c.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.contactId, e.target.value)}
                        disabled={updatingId === c.contactId}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

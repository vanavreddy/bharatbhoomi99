'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/lib/api/services/admin.service';
import { Card, Badge, Button } from '@/components/ui';
import type { AdminProperty } from '@/types';
import { useToast } from '@/contexts';
import { RefreshCw, CheckCircle, XCircle, Building2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const [rejectModal, setRejectModal] = useState<{ id: number; reason: string } | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getProperties(filter === 'all' ? undefined : filter);
      setProperties(data);
    } catch {
      setError('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveProperty(id, 0);
      showToast('Property approved');
      fetchProperties();
    } catch {
      showToast('Failed to approve property', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectModal.reason.trim()) return;
    try {
      await adminService.rejectProperty(rejectModal.id, rejectModal.reason.trim(), 0);
      setRejectModal(null);
      showToast('Property rejected');
      fetchProperties();
    } catch {
      showToast('Failed to reject property', 'error');
    }
  };

  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <Badge variant="success" size="sm">Approved</Badge>;
      case 'rejected': return <Badge variant="error" size="sm">Rejected</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      default: return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
          <p className="text-gray-500 mt-1">{properties.length} properties</p>
        </div>
        <Button variant="outline" onClick={fetchProperties} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === t.value ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Property</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Owner</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Views</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Created</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No properties found</p>
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.propertyID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">#{prop.propertyID}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                      {prop.propertyName || 'Unnamed'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.ownerName || '-'}</td>
                    <td className="px-6 py-4">{statusBadge(prop.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{prop.category || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.viewCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{prop.createdOn ? formatDate(prop.createdOn) : '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {prop.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(prop.propertyID)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectModal({ id: prop.propertyID, reason: '' })}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button type="button" onClick={() => setRejectModal(null)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Property #{rejectModal.id}</h3>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button onClick={handleReject} disabled={!rejectModal.reason.trim()} className="bg-red-500 hover:bg-red-600">
                Reject
              </Button>
              <Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

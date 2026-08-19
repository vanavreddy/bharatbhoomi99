'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/lib/api/services/admin.service';
import { Card, Badge, Button } from '@/components/ui';
import type { AdminProperty } from '@/types';
import { useToast } from '@/contexts';
import {
  RefreshCw, CheckCircle, XCircle, Building2, X,
  MapPin, Phone, Mail, Car, Droplets, Zap,
  User, ChevronLeft, ChevronRight, ImageIcon, Plus,
} from 'lucide-react';
import AddPropertySlideOver from './AddPropertySlideOver';
import { formatDate, formatPrice, formatArea } from '@/lib/utils/format';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ id: number; reason: string } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [slideImageIndex, setSlideImageIndex] = useState(0);
  const [actioningId, setActioningId] = useState<number | null>(null);

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
    setActioningId(id);
    try {
      await adminService.approveProperty(id, 0);
      showToast('Property approved');
      setSelectedProperty(null);
      fetchProperties();
    } catch {
      showToast('Failed to approve property', 'error');
    } finally {
      setActioningId(null);
    }
  };

  /**
   * Toggle the featured flag.
   *
   * The backend refuses to feature anything that is not approved, so the
   * control is only offered on approved listings; the check there is the one
   * that counts.
   */
  const handleToggleFeatured = async (id: number) => {
    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}/feature`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.apiErrors?.[0] ?? 'Could not update the listing', 'error');
        return;
      }
      const isFeatured = Boolean(data.model?.isFeatured);
      setSelectedProperty((prev) => (prev && prev.propertyID === id ? { ...prev, isFeatured } : prev));
      showToast(isFeatured ? 'Listing featured' : 'Removed from featured');
      fetchProperties();
    } catch {
      showToast('Could not reach the server', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectModal.reason.trim()) return;
    setActioningId(rejectModal.id);
    try {
      await adminService.rejectProperty(rejectModal.id, rejectModal.reason.trim(), 0);
      setRejectModal(null);
      setSelectedProperty(null);
      showToast('Property rejected');
      fetchProperties();
    } catch {
      showToast('Failed to reject property', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const openSlideOver = (prop: AdminProperty) => {
    setSelectedProperty(prop);
    setSlideImageIndex(0);
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

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm text-gray-900 text-right max-w-[60%]">{value}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
          <p className="text-gray-500 mt-1">{properties.length} properties</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Add Property
          </Button>
          <Button variant="outline" onClick={fetchProperties} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
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
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">City</th>
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
                  <tr
                    key={prop.propertyID}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openSlideOver(prop)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">#{prop.propertyID}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                      {prop.propertyName || 'Unnamed'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.ownerName || '-'}</td>
                    <td className="px-6 py-4">{statusBadge(prop.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.rent ? `₹${formatPrice(prop.rent)}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.city || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{prop.createdOn ? formatDate(prop.createdOn) : '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {prop.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={actioningId === prop.propertyID}
                              onClick={() => handleApprove(prop.propertyID)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              disabled={actioningId === prop.propertyID}
                              onClick={() => setRejectModal({ id: prop.propertyID, reason: '' })}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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

      {/* Slide-Over Panel */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 truncate max-w-[300px]">
                  {selectedProperty.propertyName || 'Unnamed Property'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">#{selectedProperty.propertyID}</span>
                  {statusBadge(selectedProperty.status)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Image Gallery */}
              {selectedProperty.imageUrls && selectedProperty.imageUrls.length > 0 ? (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={selectedProperty.imageUrls[slideImageIndex]}
                      alt={`Property image ${slideImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  {selectedProperty.imageUrls.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSlideImageIndex((i) => (i - 1 + selectedProperty.imageUrls.length) % selectedProperty.imageUrls.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlideImageIndex((i) => (i + 1) % selectedProperty.imageUrls.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {selectedProperty.imageUrls.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSlideImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === slideImageIndex ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm">No images</p>
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <DetailRow label="Type" value={selectedProperty.type} />
                  <DetailRow label="Category" value={selectedProperty.category} />
                  <DetailRow label="Price" value={selectedProperty.rent ? `₹${formatPrice(selectedProperty.rent)}` : null} />
                  <DetailRow label="Deposit" value={selectedProperty.deposit ? `₹${formatPrice(selectedProperty.deposit)}` : null} />
                  <DetailRow label="Area" value={selectedProperty.area ? formatArea(selectedProperty.area) : null} />
                  <DetailRow label="Bedrooms" value={selectedProperty.bedRooms} />
                  <DetailRow label="Bathrooms" value={selectedProperty.baths} />
                  <DetailRow label="Furnished" value={selectedProperty.isFurnished ? 'Yes' : 'No'} />
                  <DetailRow label="Negotiable" value={selectedProperty.isNegotiable ? 'Yes' : 'No'} />
                </div>
              </div>

              {/* Land/Site Section (conditional) */}
              {(selectedProperty.facing || selectedProperty.plotLength || selectedProperty.plotApprovalType) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Land / Site Details</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <DetailRow label="Facing" value={selectedProperty.facing} />
                    <DetailRow label="Plot Size" value={
                      selectedProperty.plotLength && selectedProperty.plotWidth
                        ? `${selectedProperty.plotLength} x ${selectedProperty.plotWidth} ft`
                        : null
                    } />
                    <DetailRow label="Approval Type" value={selectedProperty.plotApprovalType} />
                  </div>
                </div>
              )}

              {/* Address */}
              {(selectedProperty.addressLine1 || selectedProperty.city) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" /> Address
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                    {selectedProperty.addressLine1 && <p>{selectedProperty.addressLine1}</p>}
                    {selectedProperty.addressLine2 && <p>{selectedProperty.addressLine2}</p>}
                    <p>
                      {[selectedProperty.city, selectedProperty.state, selectedProperty.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {selectedProperty.zone && <p className="text-gray-500">Zone: {selectedProperty.zone}</p>}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {(selectedProperty.parking || selectedProperty.water || selectedProperty.electricity) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.parking && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                        <Car className="h-3.5 w-3.5" /> {selectedProperty.parking}
                      </span>
                    )}
                    {selectedProperty.water && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                        <Droplets className="h-3.5 w-3.5" /> {selectedProperty.water}
                      </span>
                    )}
                    {selectedProperty.electricity && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                        <Zap className="h-3.5 w-3.5" /> {selectedProperty.electricity}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Comments */}
              {selectedProperty.comments && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                    {selectedProperty.comments}
                  </p>
                </div>
              )}

              {/* Seller Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" /> Seller Info
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-brand-primary">
                        {selectedProperty.ownerName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedProperty.ownerName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">Owner ID: {selectedProperty.oUserID}</p>
                    </div>
                  </div>
                  {selectedProperty.ownerEmail && (
                    <a href={`mailto:${selectedProperty.ownerEmail}`} className="flex items-center gap-2 text-sm text-brand-primary hover:underline">
                      <Mail className="h-4 w-4" /> {selectedProperty.ownerEmail}
                    </a>
                  )}
                  {selectedProperty.ownerPhone && (
                    <a href={`tel:${selectedProperty.ownerPhone}`} className="flex items-center gap-2 text-sm text-brand-primary hover:underline">
                      <Phone className="h-4 w-4" /> {selectedProperty.ownerPhone}
                    </a>
                  )}
                </div>
              </div>

              {/* Builder Info */}
              {selectedProperty.builderName && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" /> Builder
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-900 font-medium">{selectedProperty.builderName}</p>
                    {selectedProperty.builderId && (
                      <p className="text-xs text-gray-500 mt-1">ID: {selectedProperty.builderId}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Metadata</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <DetailRow label="Created" value={selectedProperty.createdOn ? formatDate(selectedProperty.createdOn) : '-'} />
                  <DetailRow label="Views" value={selectedProperty.viewCount} />
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-500">Featured</span>
                    {selectedProperty.status === 'approved' ? (
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(selectedProperty.propertyID)}
                        disabled={actioningId === selectedProperty.propertyID}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors disabled:opacity-50 ${
                          selectedProperty.isFeatured
                            ? 'bg-brand-accent text-white hover:bg-brand-accent-dark'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {selectedProperty.isFeatured ? 'Featured' : 'Not featured'}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Approve first</span>
                    )}
                  </div>
                  <DetailRow label="Images" value={selectedProperty.noOfImages} />
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedProperty.status === 'rejected' && selectedProperty.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-red-700 mb-1">Rejection Reason</h3>
                  <p className="text-sm text-red-600">{selectedProperty.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedProperty.status.toLowerCase() === 'pending' && (
                <div className="flex gap-3 pt-2 pb-4">
                  <Button
                    onClick={() => handleApprove(selectedProperty.propertyID)}
                    disabled={actioningId === selectedProperty.propertyID}
                    leftIcon={<CheckCircle className="h-4 w-4" />}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {actioningId === selectedProperty.propertyID ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={actioningId === selectedProperty.propertyID}
                    onClick={() => setRejectModal({ id: selectedProperty.propertyID, reason: '' })}
                    leftIcon={<XCircle className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Property Slide-Over */}
      <AddPropertySlideOver
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={fetchProperties}
      />

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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

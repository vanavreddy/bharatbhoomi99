'use client';

import { useState } from 'react';
import { Container } from '@/components/layout';
import { Card, Badge } from '@/components/ui';
import { useEnquiries } from '@/hooks/useEnquiries';
import { useAuth } from '@/contexts';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { useToast } from '@/contexts';
import { MessageCircle, LogIn, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

type Tab = 'sent' | 'received';

const statusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return <Badge variant="success" size="sm">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="error" size="sm">Rejected</Badge>;
    default:
      return <Badge variant="default" size="sm">Pending</Badge>;
  }
};

export default function EnquiriesPage() {
  const { isAuthenticated, isGuest } = useAuth();
  const { showToast } = useToast();
  const { sent, received, isLoading, error, respondToEnquiry } = useEnquiries();
  const [tab, setTab] = useState<Tab>('sent');
  const [respondingId, setRespondingId] = useState<number | null>(null);

  const isLoggedIn = isAuthenticated && !isGuest;

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <LogIn className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view enquiries</h1>
          <p className="text-gray-600 mb-6">View and manage your property enquiries.</p>
          <Link
            href={ROUTES.SIGN_IN}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const enquiries = tab === 'sent' ? sent : received;

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">My Enquiries</h1>
          <p className="text-gray-600">Manage your property enquiries</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          <button
            type="button"
            onClick={() => setTab('sent')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'sent' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Sent ({sent.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('received')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'received' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Received ({received.length})
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              No {tab} enquiries
            </h2>
            <p className="text-gray-500 mb-6">
              {tab === 'sent' ? "You haven't sent any enquiries yet." : "No one has enquired about your properties yet."}
            </p>
            {tab === 'sent' && (
              <Link
                href={ROUTES.PROPERTIES}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
              >
                Browse Properties
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => (
              <Card key={enquiry.enquiryId} padding="none">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={ROUTES.PROPERTY_DETAIL(String(enquiry.propertyId))}
                          className="font-medium text-gray-900 hover:text-brand-primary truncate"
                        >
                          {enquiry.propertyName || `Property #${enquiry.propertyId}`}
                        </Link>
                        {statusBadge(enquiry.status)}
                      </div>
                      {tab === 'received' && enquiry.senderName && (
                        <p className="text-sm text-gray-500 mb-1">From: {enquiry.senderName}</p>
                      )}
                      <p className="text-sm text-gray-700 mb-2">{enquiry.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(enquiry.createdAt)}
                        </span>
                        {enquiry.respondedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Responded {formatDate(enquiry.respondedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {tab === 'received' && enquiry.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          disabled={respondingId === enquiry.enquiryId}
                          onClick={async () => {
                            setRespondingId(enquiry.enquiryId);
                            try {
                              await respondToEnquiry(enquiry.enquiryId, 'accepted');
                              showToast('Enquiry accepted');
                            } catch {
                              showToast('Failed to accept enquiry', 'error');
                            } finally {
                              setRespondingId(null);
                            }
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Accept"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          disabled={respondingId === enquiry.enquiryId}
                          onClick={async () => {
                            setRespondingId(enquiry.enquiryId);
                            try {
                              await respondToEnquiry(enquiry.enquiryId, 'rejected');
                              showToast('Enquiry rejected');
                            } catch {
                              showToast('Failed to reject enquiry', 'error');
                            } finally {
                              setRespondingId(null);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

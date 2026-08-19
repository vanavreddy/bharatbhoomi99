'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { enquiryService } from '@/lib/api/services/enquiry.service';
import { useAuth } from '@/contexts';
import type { Enquiry } from '@/types';

export function useEnquiries() {
  const { user, isAuthenticated, isGuest } = useAuth();
  const [sent, setSent] = useState<Enquiry[]>([]);
  const [received, setReceived] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const isLoggedIn = isAuthenticated && !isGuest && user;

  const fetchAll = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const [sentData, receivedData] = await Promise.all([
        enquiryService.getSentEnquiries(),
        enquiryService.getReceivedEnquiries(),
      ]);
      if (mountedRef.current) {
        setSent(sentData);
        setReceived(receivedData);
      }
    } catch {
      if (mountedRef.current) setError('Failed to load enquiries');
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();
    return () => { mountedRef.current = false; };
  }, [fetchAll]);

  const respondToEnquiry = useCallback(async (enquiryId: number, status: string) => {
    if (!isLoggedIn) return;
    await enquiryService.respondToEnquiry(enquiryId, status);
    fetchAll();
  }, [isLoggedIn, fetchAll]);

  return { sent, received, isLoading, error, respondToEnquiry, refetch: fetchAll };
}

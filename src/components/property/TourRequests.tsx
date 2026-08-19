'use client';

import { useCallback, useState } from 'react';
import { CalendarDays, ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts';

interface TourRequest {
  tourId: number;
  requesterName: string | null;
  preferredDate: string;
  preferredTime: string | null;
  message: string | null;
  status: string;
}

interface TourRequestsProps {
  propertyId: number;
  /** Only approved listings can receive tour requests. */
  disabled?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-semantic-warning-light text-semantic-warning',
  confirmed: 'bg-semantic-success-light text-semantic-success',
  declined: 'bg-semantic-error-light text-semantic-error',
  completed: 'bg-theme-bg-tertiary text-theme-text-secondary',
};

/**
 * Tour requests on one listing, for its owner.
 *
 * Fetched lazily on expand rather than with the listing grid: a page of twelve
 * listings would otherwise fire twelve requests for panels most owners never
 * open.
 */
export function TourRequests({ propertyId, disabled = false }: TourRequestsProps) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [tours, setTours] = useState<TourRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/properties/${propertyId}/hometours`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.apiErrors?.[0] ?? 'Could not load tour requests');
        return;
      }
      setTours(data.model ?? []);
    } catch {
      setError('Could not load tour requests');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && tours === null) void load();
  };

  const respond = async (tourId: number, status: 'confirmed' | 'declined') => {
    setUpdatingId(tourId);
    try {
      const res = await fetch(`/api/properties/${propertyId}/hometour/${tourId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.apiErrors?.[0] ?? 'Could not update the request', 'error');
        return;
      }
      // Update in place rather than refetching: the row is small and the
      // server has already confirmed the new value.
      setTours((prev) =>
        prev?.map((t) => (t.tourId === tourId ? { ...t, status } : t)) ?? prev
      );
      showToast(status === 'confirmed' ? 'Tour confirmed' : 'Tour declined', 'success');
    } catch {
      showToast('Could not reach the server', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (disabled) return null;

  const pendingCount = tours?.filter((t) => t.status === 'pending').length ?? 0;

  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Tour requests
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-brand-accent text-white">
              {pendingCount}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {isLoading && (
            <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading requests…
            </div>
          )}

          {error && <p className="py-3 text-sm text-semantic-error">{error}</p>}

          {!isLoading && !error && tours?.length === 0 && (
            <p className="py-3 text-sm text-gray-500">No tour requests yet.</p>
          )}

          {tours?.map((tour) => (
            <div key={tour.tourId} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-gray-900">
                  {tour.requesterName ?? 'A buyer'}
                </p>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                    STATUS_STYLES[tour.status] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tour.status}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(tour.preferredDate).toLocaleDateString()}
                {tour.preferredTime ? ` at ${tour.preferredTime}` : ''}
              </p>

              {tour.message && (
                <p className="mt-1.5 text-xs text-gray-600 italic">&ldquo;{tour.message}&rdquo;</p>
              )}

              {tour.status === 'pending' && (
                <div className="flex gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => respond(tour.tourId, 'confirmed')}
                    disabled={updatingId === tour.tourId}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-brand-primary text-white hover:bg-brand-primary-dark disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => respond(tour.tourId, 'declined')}
                    disabled={updatingId === tour.tourId}
                    className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

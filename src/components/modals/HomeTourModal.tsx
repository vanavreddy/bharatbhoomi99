'use client';

import { useState } from 'react';
import { Button, Input, TextArea } from '@/components/ui';
import { hometourService } from '@/lib/api/services/hometour.service';
import { useToast } from '@/contexts';
import { X, CalendarDays, CheckCircle } from 'lucide-react';

interface HomeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  userId: number;
  propertyTitle?: string;
}

export function HomeTourModal({ isOpen, onClose, propertyId, userId, propertyTitle }: HomeTourModalProps) {
  const { showToast } = useToast();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0] as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Please select a date');
      return;
    }
    if (date < today) {
      setError('Date must be in the future');
      return;
    }

    setIsSubmitting(true);
    try {
      await hometourService.requestTour(
        propertyId,
        userId,
        date,
        time || undefined,
        message.trim() || undefined
      );
      setSubmitted(true);
      showToast('Tour request submitted');
    } catch {
      setError('Failed to schedule tour. Please try again.');
      showToast('Failed to schedule tour', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDate('');
    setTime('');
    setMessage('');
    setError('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tour Scheduled!</h3>
            <p className="text-sm text-gray-500 mb-4">The property owner will confirm your visit.</p>
            <Button variant="outline" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-4 bg-brand-primary/10 rounded-xl flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-brand-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Schedule a Visit</h2>
            {propertyTitle && (
              <p className="text-sm text-gray-500 text-center mb-4 truncate">
                {propertyTitle}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Preferred Date"
                name="date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Input
                label="Preferred Time"
                name="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                hint="Optional"
              />
              <TextArea
                label="Message"
                name="message"
                placeholder="Any special requests or questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                fullWidth
                size="lg"
                className="rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Request Tour'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

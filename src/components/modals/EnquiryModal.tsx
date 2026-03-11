'use client';

import { useState } from 'react';
import { Button, TextArea } from '@/components/ui';
import { enquiryService } from '@/lib/api/services/enquiry.service';
import { useToast } from '@/contexts';
import { X, MessageCircle, CheckCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  userId: number;
  propertyTitle?: string;
}

export function EnquiryModal({ isOpen, onClose, propertyId, userId, propertyTitle }: EnquiryModalProps) {
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }
    if (trimmed.length > 1000) {
      setError('Message must be under 1000 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await enquiryService.sendEnquiry(propertyId, userId, trimmed);
      setSubmitted(true);
      showToast('Enquiry sent successfully');
    } catch {
      setError('Failed to send enquiry. Please try again.');
      showToast('Failed to send enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
            <p className="text-sm text-gray-500 mb-4">The property owner will be notified.</p>
            <Button variant="outline" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-4 bg-brand-primary/10 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-brand-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Send Enquiry</h2>
            {propertyTitle && (
              <p className="text-sm text-gray-500 text-center mb-4 truncate">
                About: {propertyTitle}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextArea
                label="Your Message"
                name="message"
                placeholder="Hi, I'm interested in this property. I'd like to know more about..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                showCount
                error={error}
                required
              />
              <Button
                type="submit"
                fullWidth
                size="lg"
                className="rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

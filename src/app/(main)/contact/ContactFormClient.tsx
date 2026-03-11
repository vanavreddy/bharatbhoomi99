'use client';

import { useState } from 'react';
import { Button, Input, TextArea } from '@/components/ui';
import { contactService } from '@/lib/api/services/contact.service';
import { useToast } from '@/contexts';
import { Send, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';
  if (!data.subject.trim()) errors.subject = 'Subject is required';
  if (!data.message.trim()) errors.message = 'Message is required';
  else if (data.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export default function ContactFormClient() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
      showToast('Message sent successfully');
    } catch {
      setServerError('Failed to send message. Please try again.');
      showToast('Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6">Thank you for reaching out. We&apos;ll get back to you soon.</p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          placeholder="Your name"
          required
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />
      </div>
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+91 98765 43210"
        hint="Optional, but helps us reach you faster"
        value={form.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <Input
        label="Subject"
        name="subject"
        placeholder="What is your inquiry about?"
        required
        value={form.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
        error={errors.subject}
      />
      <TextArea
        label="Message"
        name="message"
        placeholder="Tell us how we can help you..."
        required
        maxLength={1000}
        showCount
        value={form.message}
        onChange={(e) => handleChange('message', e.target.value)}
        error={errors.message}
      />
      {serverError && (
        <p className="text-sm text-red-600">{serverError}</p>
      )}
      <Button
        type="submit"
        size="lg"
        leftIcon={<Send className="h-5 w-5" />}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

/**
 * Contact Service — submits contact form via internal Next.js proxy
 * Called from client-side components, so uses relative URLs
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse, BBContactFormRequest } from '../bb-types';

export interface IContactService {
  submitContactForm(data: BBContactFormRequest): Promise<number>;
}

class ContactService implements IContactService {
  async submitContactForm(formData: BBContactFormRequest): Promise<number> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data: BBApiResponse<number> = await res.json();
    return unwrapBBResponse(data);
  }
}

export const contactService = new ContactService();

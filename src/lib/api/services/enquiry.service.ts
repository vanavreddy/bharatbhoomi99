/**
 * Enquiry Service — manages property enquiries via internal Next.js proxy
 * Called from client-side hooks, so uses relative URLs to hit proxy routes
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse, BBSendEnquiryRequest, ExternalBBEnquiry, BBRespondEnquiryRequest } from '../bb-types';
import type { Enquiry } from '@/types';

export interface IEnquiryService {
  sendEnquiry(propertyId: number, senderUserId: number, message: string): Promise<void>;
  getSentEnquiries(): Promise<Enquiry[]>;
  getReceivedEnquiries(): Promise<Enquiry[]>;
  respondToEnquiry(id: number, status: string): Promise<void>;
}

class EnquiryService implements IEnquiryService {
  async sendEnquiry(propertyId: number, senderUserId: number, message: string): Promise<void> {
    const body: BBSendEnquiryRequest = { propertyId, senderUserId, message };
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<BBSendEnquiryRequest> = await res.json();
    unwrapBBResponse(data);
  }

  async getSentEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/enquiry/sent', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: BBApiResponse<ExternalBBEnquiry[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async getReceivedEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/enquiry/received', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: BBApiResponse<ExternalBBEnquiry[]> = await res.json();
    return unwrapBBResponse(data);
  }

  async respondToEnquiry(id: number, status: string): Promise<void> {
    const body: BBRespondEnquiryRequest = { status };
    const res = await fetch(`/api/enquiry/${id}/respond`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<string> = await res.json();
    unwrapBBResponse(data);
  }
}

export const enquiryService = new EnquiryService();

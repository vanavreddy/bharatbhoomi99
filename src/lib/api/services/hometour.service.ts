/**
 * Home Tour Service — manages home tour requests via internal Next.js proxy
 * Called from client-side components, so uses relative URLs
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse, ExternalBBHomeTour } from '../bb-types';
import type { HomeTourRequest } from '@/types';

export interface IHomeTourService {
  requestTour(propertyId: number, userId: number, date: string, time?: string, message?: string): Promise<HomeTourRequest>;
}

class HomeTourService implements IHomeTourService {
  async requestTour(
    propertyId: number,
    userId: number,
    date: string,
    time?: string,
    message?: string
  ): Promise<HomeTourRequest> {
    const body = { userId, preferredDate: date, preferredTime: time, message };
    const res = await fetch(`/api/properties/${propertyId}/hometour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data: BBApiResponse<ExternalBBHomeTour> = await res.json();
    return unwrapBBResponse(data);
  }
}

export const hometourService = new HomeTourService();

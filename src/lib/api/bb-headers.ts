/**
 * BB Header Utilities — construct auth headers for BB API endpoints
 */

import { NextRequest } from 'next/server';
import { API_CONFIG } from './config';
import { getAdminSession } from '../admin-auth';

export function bbUserHeaders(userId: number | string): Record<string, string> {
  return {
    'X-BB-User-Id': String(userId),
    'Content-Type': 'application/json',
  };
}

export function bbAdminHeaders(): Record<string, string> {
  return {
    'X-BB-Admin-Key': API_CONFIG.ADMIN_KEY,
    'Content-Type': 'application/json',
  };
}

/** Build headers for team-authenticated admin requests.
 *  Sends X-BB-Team-User-Id from the admin session cookie. */
export function bbTeamHeaders(request: NextRequest): Record<string, string> {
  const session = getAdminSession(request);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session) {
    headers['X-BB-Team-User-Id'] = String(session.userId);
  }
  return headers;
}

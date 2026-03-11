/**
 * BB Header Utilities — construct auth headers for BB API endpoints
 */

import { API_CONFIG } from './config';

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

/**
 * BB Header Utilities — build the headers a proxy route sends to the backend.
 *
 * The backend no longer accepts `X-BB-User-Id` / `X-BB-Team-User-Id`. Those
 * were unsigned integers: anything that could reach the API could impersonate
 * any user by changing a digit. Identity now travels as a signed `bb_session`
 * cookie, so a proxy route's job is simply to relay the browser's cookie
 * header and let the backend verify the signature.
 */

import { NextRequest } from 'next/server';
import { API_CONFIG } from './config';

/**
 * Headers for any authenticated backend call.
 *
 * Forwards the whole cookie header rather than picking out `bb_session`: the
 * browser already scopes cookies to this origin, and re-implementing cookie
 * parsing here would be a second place to get it wrong.
 */
export function bbHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const cookie = request.headers.get('cookie');
  if (cookie) headers.Cookie = cookie;
  return headers;
}

/**
 * Same, minus Content-Type — for multipart bodies, where fetch must set the
 * boundary itself. Passing a Content-Type here produces a request the backend
 * cannot parse.
 */
export function bbUploadHeaders(request: NextRequest): Record<string, string> {
  const cookie = request.headers.get('cookie');
  return cookie ? { Cookie: cookie } : {};
}

/**
 * Admin-team headers. Unchanged signature so existing call sites keep working;
 * the session cookie now carries the identity that `X-BB-Team-User-Id` used to.
 */
export function bbTeamHeaders(request: NextRequest): Record<string, string> {
  return bbHeaders(request);
}

/**
 * Bootstrap only: the static shared key that creates the first super admin.
 * Every other admin call runs on a normal session.
 */
export function bbAdminHeaders(): Record<string, string> {
  return {
    'X-BB-Admin-Key': API_CONFIG.ADMIN_KEY,
    'Content-Type': 'application/json',
  };
}

/**
 * Copies the backend's `Set-Cookie` onto the response the browser receives.
 *
 * Login and logout responses are the only place the session is created or
 * cleared. Without this relay the cookie would stop at the Next.js server and
 * the browser would never hold a session. The header is copied verbatim, so
 * HttpOnly, SameSite and Max-Age survive; the browser scopes it to this origin
 * because the backend sets no Domain attribute.
 */
export function relaySetCookie(from: Response, to: Response): void {
  const setCookie = from.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookie) {
    to.headers.append('set-cookie', cookie);
  }
}

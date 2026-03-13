/**
 * Admin Session Auth — HMAC-SHA256 signed cookie tokens (no external deps)
 * Token format: <role>:<userId>:<expires>:<hmac>
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'bb_admin_session';
const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 hours
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set');
  return secret;
}

export interface AdminSession {
  role: string;
  userId: number;
}

/** Create an HMAC-SHA256 signed session token carrying role + userId */
export function createAdminSessionToken(role: string, userId: number): string {
  const secret = getSecret();
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = `${role}:${userId}:${expires}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

/** Verify a signed session token. Returns session info if valid, null if not. */
export function verifyAdminSessionToken(token: string): AdminSession | null {
  try {
    const secret = getSecret();
    const parts = token.split(':');
    if (parts.length !== 4) return null;

    const role = parts[0];
    const userIdStr = parts[1];
    const expiresStr = parts[2];
    const sig = parts[3];
    if (!role || !userIdStr || !expiresStr || !sig) return null;

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId) || userId < 0) return null;

    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || expires < Math.floor(Date.now() / 1000)) return null;

    const expectedSig = createHmac('sha256', secret)
      .update(`${role}:${userIdStr}:${expiresStr}`)
      .digest('hex');

    const valid = timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'));
    if (!valid) return null;

    return { role, userId };
  } catch {
    return null;
  }
}

/** Validate the admin session from the request's cookie. Returns 401 response if invalid. */
export function validateAdminSession(
  request: NextRequest
): NextResponse | null {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { apiErrors: ['Admin authentication required'] },
      { status: 401 }
    );
  }
  return null; // valid
}

/** Extract the admin session from the request cookie. Returns null if invalid/expired. */
export function getAdminSession(request: NextRequest): AdminSession | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

/** Build Set-Cookie header value for the admin session */
export function adminSessionSetCookie(token: string): string {
  const secure = IS_PRODUCTION ? ' Secure;' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=${TOKEN_TTL_SECONDS}`;
}

/** Build Set-Cookie header value that clears the admin session */
export function adminSessionClearCookie(): string {
  const secure = IS_PRODUCTION ? ' Secure;' : '';
  return `${COOKIE_NAME}=; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=0`;
}

/**
 * Admin Session Auth — HMAC-SHA256 signed cookie tokens (no external deps)
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'bb_admin_session';
const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set');
  return secret;
}

/** Create an HMAC-SHA256 signed session token */
export function createAdminSessionToken(): string {
  const secret = getSecret();
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = `admin:${expires}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

/** Verify a signed session token. Returns true if valid and not expired. */
export function verifyAdminSessionToken(token: string): boolean {
  try {
    const secret = getSecret();
    const parts = token.split(':');
    if (parts.length !== 3) return false;

    const role = parts[0]!;
    const expiresStr = parts[1]!;
    const sig = parts[2]!;
    if (role !== 'admin') return false;

    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || expires < Math.floor(Date.now() / 1000)) return false;

    const expectedSig = createHmac('sha256', secret)
      .update(`${role}:${expiresStr}`)
      .digest('hex');

    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('NEXTAUTH_SECRET')) {
      console.error('Admin auth misconfigured: NEXTAUTH_SECRET is not set');
    }
    return false;
  }
}

/** Validate the admin session from the request's cookie. Returns 401 response if invalid. */
export function validateAdminSession(
  request: NextRequest
): NextResponse | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json(
      { apiErrors: ['Admin authentication required'] },
      { status: 401 }
    );
  }
  return null; // valid
}

/** Build Set-Cookie header value for the admin session */
export function adminSessionSetCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=${TOKEN_TTL_SECONDS}`;
}

/** Build Set-Cookie header value that clears the admin session */
export function adminSessionClearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=0`;
}

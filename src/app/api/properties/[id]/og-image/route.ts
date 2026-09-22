/**
 * GET /api/properties/[id]/og-image
 *
 * A permanent URL for a listing's primary photo, for Open Graph tags.
 *
 * The blob itself is only reachable through a SAS token that expires in
 * minutes. Putting that signed URL straight into `og:image` produces a link
 * preview that works for half an hour and is broken forever after — and social
 * crawlers fetch the image when the link is *shared*, which is usually long
 * after the page was rendered. This route stays stable and redirects to a
 * freshly signed URL each time it is hit.
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { SITE_CONFIG } from '@/lib/constants/seo';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY.DETAIL(id)}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    const first: unknown = data?.model?.imageUrls?.[0];

    if (typeof first !== 'string' || first.length === 0) {
      return NextResponse.redirect(new URL(SITE_CONFIG.ogImage, API_CONFIG.APP_URL));
    }

    // Having a URL is not the same as the blob being fetchable. Listings created
    // before the storage migration hold absolute URLs to the old NammaKutira
    // account, which the backend passes through unsigned because it cannot sign
    // against a different account. Those return 409, so redirecting to them
    // hands social crawlers an error and the preview renders blank — worse than
    // showing the default image, and invisible until someone shares a link.
    const reachable = await fetch(first, { method: 'HEAD', cache: 'no-store' })
      .then((r) => r.ok)
      .catch(() => false);

    if (!reachable) {
      return NextResponse.redirect(new URL(SITE_CONFIG.ogImage, API_CONFIG.APP_URL));
    }

    // 302, not 301: the target carries a short-lived token, so this must never
    // be cached as permanent by a crawler or CDN.
    return NextResponse.redirect(first, { status: 302 });
  } catch {
    return NextResponse.redirect(new URL(SITE_CONFIG.ogImage, API_CONFIG.APP_URL));
  }
}

# Bharat Bhoomi 99 — Frontend Architecture Guide

## Overview

Next.js 14 (App Router) frontend that proxies all API calls through server-side route handlers to the .NET backend. No direct client-to-backend communication.

```
Browser → Next.js API Route (proxy) → .NET Backend → Azure SQL / Blob
```

---

## Folder Structure

```
src/
├── app/
│   ├── (main)/                      ← Public pages (wrapped in main layout)
│   │   ├── properties/                 Property listing + search
│   │   ├── list-property/              Property creation form
│   │   ├── builders/                   Builder profiles
│   │   ├── contact/                    Contact page
│   │   └── ...
│   │
│   ├── (auth)/                      ← Auth pages (sign-in, sign-up)
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── (admin)/                     ← Admin panel pages
│   │   └── admin/
│   │       ├── properties/             Property approval
│   │       ├── analytics/              Dashboard
│   │       └── ...
│   │
│   └── api/                         ← Server-side proxy routes
│       ├── admin/                      Admin API proxies
│       │   ├── auth/route.ts             Login/logout (HMAC session cookie)
│       │   ├── analytics/route.ts        Dashboard stats
│       │   ├── builders/                 Builder CRUD + logo upload
│       │   ├── contact-enquiries/        Contact management
│       │   └── properties/               Property approval/rejection
│       │
│       ├── auth/                       User auth proxies
│       │   ├── register/route.ts         BB user registration
│       │   ├── login/route.ts            BB user login
│       │   ├── admin-login/route.ts      Admin key validation
│       │   ├── generate-otp/route.ts     NK legacy OTP
│       │   ├── validate-otp/route.ts     NK legacy OTP
│       │   ├── validate-password/route.ts NK legacy password
│       │   └── create-user/route.ts      NK legacy user creation
│       │
│       ├── properties/                 Property API proxies
│       │   ├── route.ts                  List approved properties
│       │   ├── create/route.ts           Create property (JSON or multipart)
│       │   ├── search/route.ts           Search properties
│       │   ├── filters/route.ts          Get filter options
│       │   └── [id]/
│       │       ├── route.ts              Get property detail
│       │       ├── hometour/route.ts     Request home tour
│       │       └── contact-view/route.ts Record contact view
│       │
│       ├── builders/                   Builder proxies
│       ├── enquiry/                    Enquiry proxies
│       ├── favourites/                 Favourite proxies
│       ├── contact/                    Contact form proxy
│       ├── analytics/                  View tracking proxy
│       └── user/
│           └── avatar/route.ts         Avatar upload proxy
│
├── lib/
│   ├── api/
│   │   ├── config.ts                ← API_CONFIG (base URL, all endpoints)
│   │   ├── http-client.ts           ← Shared fetch wrapper (retry, timeout)
│   │   ├── errors.ts                ← ApiError class
│   │   ├── bb-headers.ts            ← Header builders (bbUserHeaders, bbAdminHeaders)
│   │   ├── bb-types.ts              ← Backend response types
│   │   ├── types.ts                 ← Frontend types
│   │   ├── mappers.ts               ← Backend → Frontend type mappers
│   │   ├── index.ts                 ← Re-exports
│   │   └── services/
│   │       ├── property.service.ts    Property operations
│   │       └── admin.service.ts       Admin operations
│   │
│   ├── admin-auth.ts                ← HMAC-SHA256 session tokens (admin auth)
│   └── api/authService.ts           ← User auth operations
│
├── contexts/
│   └── AuthContext.tsx               ← User session state (localStorage)
│
├── hooks/
│   └── useCreateProperty.ts         ← Property creation hook (FormData)
│
├── components/                      ← UI components
│   ├── sections/                      Page sections (Hero, Testimonials)
│   └── ui/                            Reusable UI components
│
└── types/
    ├── auth.types.ts                ← Auth type definitions
    └── bb.types.ts                  ← BB entity type definitions
```

---

## Proxy Route Pattern

Every API route follows this pattern:

```typescript
// src/app/api/{feature}/route.ts
export async function POST(request: NextRequest) {
  try {
    // 1. Extract auth headers
    const userId = request.headers.get('X-BB-User-Id');

    // 2. Parse request body
    const body = await request.json();

    // 3. Forward to .NET backend
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/bb/...`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-BB-User-Id': userId },
      body: JSON.stringify(body),
    });

    // 4. Parse backend response
    const data = await response.json();

    // 5. Check for errors (backend returns apiErrors array)
    if (data.apiErrors?.length > 0) {
      return NextResponse.json({ success: false, error: data.apiErrors[0] }, { status: 400 });
    }

    // 6. Return success
    return NextResponse.json({ success: true, data: data.model });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 });
  }
}
```

---

## Authentication

### User Auth
- BB users register/login via `/api/auth/register` and `/api/auth/login`
- User data stored in `localStorage` (key: `bharatbhoomi_user`)
- `X-BB-User-Id` header sent with authenticated requests
- Managed by `AuthContext.tsx`

### Admin Auth
- Admin logs in with admin key via `/api/admin/auth` (POST)
- Server creates HMAC-SHA256 signed cookie (`bb_admin_session`)
- Cookie path: `/api/admin` (only sent to admin API routes)
- All admin proxy routes call `validateAdminSession(request)` before forwarding
- Token TTL: 8 hours

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_BASE_URL` | Yes | .NET backend URL |
| `BB_ADMIN_KEY` | Yes | Admin key (must match backend `BbAdminKey`) |
| `NEXTAUTH_SECRET` | Yes | Secret for admin HMAC session tokens |
| `NEXT_PUBLIC_APP_NAME` | No | Display name |
| `NEXT_PUBLIC_APP_URL` | No | Frontend URL |

---

## Adding a New API Proxy Route

1. Add endpoint path to `src/lib/api/config.ts` → `API_CONFIG.ENDPOINTS`
2. Create route file at `src/app/api/{path}/route.ts`
3. Follow the proxy pattern above
4. For admin routes: add `validateAdminSession(request)` check
5. For user routes: extract `X-BB-User-Id` from headers

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api/config';
import { bbTeamHeaders } from '@/lib/api/bb-headers';
import { getAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

const adminCreatePropertySchema = z.object({
  propertyName: z.string().optional().default(''),
  category: z.string().min(1, 'Category is required'),
  builderId: z.string().optional(),
  area: z.number().positive('Area must be positive'),
  bedrooms: z.number().int().min(0).max(20).default(0),
  bathrooms: z.number().int().min(0).max(10).default(0),
  price: z.number().positive('Price must be positive'),
  deposit: z.number().min(0).default(0),
  isNegotiable: z.boolean().default(false),
  isFurnished: z.boolean().default(false),
  comments: z.string().optional().default(''),
  parking: z.string().optional().default('None'),
  water: z.string().optional().default('Municipal'),
  electricity: z.string().optional().default('Grid'),
  facing: z.string().optional(),
  plotLength: z.number().min(0).optional(),
  plotWidth: z.number().min(0).optional(),
  plotApprovalType: z.string().optional(),
  address: z.object({
    addressLine1: z.string().optional().default(''),
    addressLine2: z.string().optional().default(''),
    city: z.string().min(1, 'City is required').default('Bangalore'),
    state: z.string().optional().default('Karnataka'),
    country: z.string().optional().default('India'),
    zipCode: z.string().optional().default(''),
    zone: z.string().optional().default(''),
  }).default({}),
  autoApprove: z.boolean().default(true),
  ownerUserId: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: 'AUTH_ERROR', message: 'Admin authentication required' } },
      { status: 401 }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    let rawBody: unknown = null;
    let imageFiles: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const dataField = formData.get('data');
      if (typeof dataField === 'string') {
        rawBody = JSON.parse(dataField);
      }
      imageFiles = formData.getAll('images').filter((f): f is File => f instanceof File);
    } else {
      rawBody = await request.json().catch(() => null);
    }

    if (!rawBody) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Request body is required' } },
        { status: 400 }
      );
    }

    const validation = adminCreatePropertySchema.safeParse(rawBody);
    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors } },
        { status: 400 }
      );
    }

    const input = validation.data;

    // Map frontend fields → backend fields (same mapping as /api/properties/create)
    const backendData = {
      propertyName: input.propertyName || `${input.category} in ${input.address.city}`,
      type: input.category,
      category: input.category,
      bedRooms: String(input.bedrooms),
      baths: String(input.bathrooms),
      rent: input.price,
      deposit: input.deposit,
      area: input.area,
      isNegotiable: input.isNegotiable,
      isFurnished: input.isFurnished,
      comments: input.comments,
      parking: input.parking,
      water: input.water,
      electricity: input.electricity,
      noOfImages: imageFiles.length,
      addressLine1: input.address.addressLine1,
      addressLine2: input.address.addressLine2,
      city: input.address.city,
      state: input.address.state,
      country: input.address.country,
      zipCode: input.address.zipCode,
      zone: input.address.zone,
      builderId: input.builderId || null,
      facing: input.facing || null,
      plotLength: input.plotLength || null,
      plotWidth: input.plotWidth || null,
      plotApprovalType: input.plotApprovalType || null,
    };

    const ownerUserId = String(input.ownerUserId ?? session.userId);
    const autoApprove = input.autoApprove;

    // Build headers: admin key + owner user id
    const headers: Record<string, string> = {
      ...bbTeamHeaders(request),
      'X-BB-User-Id': ownerUserId,
    };

    let response: Response;

    if (imageFiles.length > 0) {
      const backendFormData = new FormData();
      backendFormData.append('data', JSON.stringify(backendData));
      for (const file of imageFiles) {
        backendFormData.append('images', file);
      }
      // Remove Content-Type so fetch sets multipart boundary
      const { 'Content-Type': _, ...headersWithoutCT } = headers;
      response = await fetch(`${BASE_URL}${ENDPOINTS.PROPERTY.CREATE}`, {
        method: 'POST',
        headers: headersWithoutCT,
        body: backendFormData,
      });
    } else {
      response = await fetch(`${BASE_URL}${ENDPOINTS.PROPERTY.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(backendData),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let message = 'Backend error';
      try {
        const errorJson = JSON.parse(errorText);
        message = errorJson.apiErrors?.[0] || errorJson.message || message;
      } catch {
        message = `Backend returned status ${response.status}`;
      }
      return NextResponse.json(
        { success: false, error: { code: 'SERVER_ERROR', message } },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.apiErrors && data.apiErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVER_ERROR', message: data.apiErrors[0] } },
        { status: 400 }
      );
    }

    const propertyId = data.model?.bbPropertyId;

    // Auto-approve if flag is set and we got a property ID
    let autoApproved = false;
    if (autoApprove && propertyId) {
      try {
        const approveRes = await fetch(`${BASE_URL}${ENDPOINTS.BB_ADMIN.APPROVE(propertyId)}`, {
          method: 'PATCH',
          headers: bbTeamHeaders(request),
        });
        autoApproved = approveRes.ok;
      } catch {
        // Auto-approve failed but property was still created — caller sees autoApproved: false
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          propertyId,
          message: autoApproved
            ? 'Property created and approved'
            : autoApprove
              ? 'Property created (auto-approve failed — still pending)'
              : 'Property created successfully',
          autoApproved,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

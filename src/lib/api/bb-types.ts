/**
 * BB External API Types — shapes returned by the NammaKutira BB backend
 */

// Generic BB API response wrapper
export interface BBApiResponse<T> {
  isAuthorized: boolean;
  model: T;
  apiErrors: string[];
}

// Builder
export interface ExternalBBBuilder {
  builderId: string;
  name: string;
  slug: string;
  initials: string;
  color: string;
  description: string | null;
  projectCount: number;
  established: string | null;
  headQuarters: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

// Favorite
export interface ExternalBBFavorite {
  favoriteId: number;
  userId: number;
  propertyId: number;
  createdAt: string;
  propertyName: string | null;
  rent: number | null;
  city: string | null;
  status: string | null;
}

// Enquiry
export interface ExternalBBEnquiry {
  enquiryId: number;
  propertyId: number;
  senderUserId: number;
  ownerUserId: number;
  message: string;
  status: string;
  createdAt: string;
  respondedAt: string | null;
  senderName: string | null;
  propertyName: string | null;
}

// Contact form request
export interface BBContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Property view tracking request
export interface BBPropertyViewRequest {
  propertyId: number;
  userId?: number;
  sessionId?: string;
  ipAddress?: string;
}

// Home tour request
export interface BBHomeTourRequest {
  userId: number;
  preferredDate: string;
  preferredTime?: string;
  message?: string;
}

// Home tour response
export interface ExternalBBHomeTour {
  tourId: number;
  propertyId: number;
  userId: number;
  preferredDate: string;
  preferredTime: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

// Contact view request
export interface BBContactViewRequest {
  propertyId: number;
  viewerUserId: number;
  ownerUserId: number;
}

// Admin analytics summary
export interface ExternalBBAnalytics {
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  totalPropertyViews: number;
  totalEnquiries: number;
  totalContactSubmissions: number;
  totalFavorites: number;
  totalHomeTourRequests: number;
}

// Admin property
export interface ExternalBBAdminProperty {
  propertyID: number;
  propertyName: string | null;
  status: string;
  rejectionReason: string | null;
  approvedBy: number | null;
  approvedAt: string | null;
  isFeatured: boolean;
  viewCount: number;
  isDeleted: boolean;
  builderId: string | null;
  category: string | null;
  createdOn: string | null;
  oUserID: number | null;
  ownerName: string | null;
  // Enriched fields
  type: string | null;
  bedRooms: string | null;
  baths: string | null;
  rent: number;
  deposit: number;
  area: number;
  isNegotiable: boolean;
  isFurnished: boolean;
  comments: string | null;
  parking: string | null;
  water: string | null;
  electricity: string | null;
  facing: string | null;
  plotLength: number | null;
  plotWidth: number | null;
  plotApprovalType: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  zone: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  builderName: string | null;
  imageUrls: string[];
  noOfImages: number;
}

// Admin contact enquiry
export interface ExternalBBContactEnquiry {
  contactId: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  respondedAt: string | null;
}

// Admin builder create request
export interface BBCreateBuilderRequest {
  builderId: string;
  name: string;
  slug: string;
  initials: string;
  color: string;
  description?: string;
  projectCount: number;
  established?: string;
  headQuarters?: string;
}

// Admin builder update request
export interface BBUpdateBuilderRequest {
  name: string;
  initials: string;
  color: string;
  description?: string;
  projectCount: number;
  established?: string;
  headQuarters?: string;
}

// Enquiry send request
export interface BBSendEnquiryRequest {
  propertyId: number;
  senderUserId: number;
  message: string;
}

// Enquiry respond request
export interface BBRespondEnquiryRequest {
  status: string;
}

// Favorite add request
export interface BBAddFavoriteRequest {
  userId: number;
  propertyId: number;
}

// Admin approve/reject requests
export interface BBApprovePropertyRequest {
  adminUserId: number;
}

export interface BBRejectPropertyRequest {
  rejectionReason: string;
  adminUserId: number;
}

export interface BBUpdateContactStatusRequest {
  status: string;
}

/**
 * BB Domain Types — frontend-facing types for BB features
 */

export interface Favorite {
  favoriteId: number;
  userId: number;
  propertyId: number;
  createdAt: string;
  propertyName: string | null;
  rent: number | null;
  city: string | null;
  status: string | null;
}

export interface Enquiry {
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

export interface HomeTourRequest {
  tourId: number;
  propertyId: number;
  userId: number;
  preferredDate: string;
  preferredTime: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export interface AdminProperty {
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
}

export interface AdminAnalytics {
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

export interface ContactEnquiry {
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

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

// --- Team Management Types ---

export interface TeamMember {
  teamMemberId: number;
  userId: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export interface AdminInvite {
  inviteId: number;
  phone: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

export interface TeamStatus {
  hasTeamMembers: boolean;
}

export type AdminRole = 'super_admin' | 'property_manager' | 'content_manager' | 'viewer';

const ADMIN_ROLES: readonly string[] = ['super_admin', 'property_manager', 'content_manager', 'viewer'];

export function isAdminRole(value: string): value is AdminRole {
  return ADMIN_ROLES.includes(value);
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  property_manager: 'Property Manager',
  content_manager: 'Content Manager',
  viewer: 'Viewer',
};

export function hasAdminPermission(role: string, permission: string): boolean {
  switch (permission) {
    case 'view_dashboard':
    case 'view_properties':
      return true;
    case 'approve_reject_properties':
    case 'create_properties':
      return role === 'super_admin' || role === 'property_manager';
    case 'manage_builders':
    case 'manage_contacts':
      return role === 'super_admin' || role === 'content_manager';
    case 'manage_team':
      return role === 'super_admin';
    default:
      return false;
  }
}

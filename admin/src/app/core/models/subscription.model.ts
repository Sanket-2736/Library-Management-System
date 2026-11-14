/**
 * SubscriptionDTO from backend - represents both plan and user subscription
 * Backend returns this DTO for active subscriptions and subscription plans
 */
export interface SubscriptionDTO {
  id: number;
  name: string; // Plan name
  planCode: string; // Plan identifier
  description?: string;
  price: number; // Price in smallest currency unit (e.g., paise for INR)
  currencyCode?: string;
  durationDays: number;
  maxBooksAllowed: number;
  maxDaysPerBook: number;
  isActive?: boolean;
  isFeatured?: boolean;
  badgeText?: string;
  displayOrder?: number;
  monthlyEquivalentPrice?: number;
  priceInMajorUnits?: number; // Price in major units (e.g., rupees for INR)
  adminNotes?: string;
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

/**
 * For requests that need to subscribe to a plan
 * Send the full SubscriptionDTO with plan details
 */
export type CreateSubscriptionRequest = SubscriptionDTO;

/**
 * User's active subscription instance (not used in current backend API)
 * Keeping for potential future use in admin panel
 */
export interface UserSubscription {
  id: number;
  userId: number;
  planId: number;
  startDate: string; // LocalDateTime from backend
  endDate: string; // LocalDateTime from backend
  status: SubscriptionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface SubscriptionSearchRequest {
  userId?: number;
  status?: SubscriptionStatus;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

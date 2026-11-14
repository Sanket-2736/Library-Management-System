export interface SubscriptionPlan {
  id: number;
  planCode: string;
  name: string;
  description?: string;
  maxBooksAllowed: number;
  durationDays: number;
  price: number;
  currencyCode?: string;
  maxDaysPerBook: number;
  displayOrder?: number;
  isActive: boolean;
  isFeatured?: boolean;
  badgeText?: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  planName?: string;
  maxBooksAllowed?: number;
  maxDaysPerBook?: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  price?: number;
  planCode?: string;
  durationDays?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface CreateSubscriptionRequest {
  planId: number;
}

export interface SubscriptionHistory {
  id: number;
  planName: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  price: number;
  durationDays: number;
  maxBooksAllowed: number;
}

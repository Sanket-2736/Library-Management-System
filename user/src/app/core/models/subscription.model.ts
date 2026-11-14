export interface SubscriptionPlan {
  id: number;
  name: string;
  description?: string;
  maxBooksAllowed: number;
  durationDays: number;
  price: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  planName?: string;
  maxBooksAllowed?: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  price?: number;
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

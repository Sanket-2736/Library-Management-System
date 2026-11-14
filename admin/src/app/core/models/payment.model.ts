export interface PaymentDTO {
  id: number;
  subscriptionId: number;
  amount: number;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentDate: string; // LocalDateTime from backend
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  subscriptionId: number;
}

export interface PaymentSearchRequest {
  status?: PaymentStatus;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

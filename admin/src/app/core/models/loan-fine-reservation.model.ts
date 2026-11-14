/**
 * Book Loan, Fine, and Reservation Models
 * Comprehensive models for loan management, fine tracking, and reservations
 */

// ============= BOOK LOAN MODELS =============

export interface BookLoanDetail extends BookLoan {
  // Extended loan information with book details
  bookTitle?: string;
  bookAuthor?: string;
  bookCoverUrl?: string;
  daysDueIn?: number;
  daysOverdue?: number;
}

// ============= FINE MODELS =============

export interface Fine {
  id: number;
  userId: number;
  bookLoanId: number;
  fineType: FineType;
  amount: number; // In smallest currency unit (paise)
  amountPaid: number;
  status: FineStatus;
  reason?: string;
  notes?: string;
  waivedByUserId?: number;
  waivedAt?: string; // LocalDateTime from backend
  waiverReason?: string;
  paidAt?: string; // LocalDateTime from backend
  processedByUserId?: number;
  transactionId?: string;
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

export enum FineType {
  OVERDUE = 'OVERDUE',
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS',
  PROCESSING = 'PROCESSING',
}

export enum FineStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  WAIVED = 'WAIVED',
}

export interface FineFilter {
  status?: FineStatus;
  type?: FineType;
}

export interface PaymentInitiateResponse {
  orderId: string;
  amount: number;
  currency?: string;
  description?: string;
  razorpayKeyId?: string;
  [key: string]: any; // Razorpay specific fields
}

// ============= RESERVATION MODELS =============

export interface Reservation {
  id: number;
  userId: number;
  bookId: number;
  bookTitle?: string;
  status: ReservationStatus;
  reservedAt: string; // LocalDateTime from backend
  availableAt?: string; // LocalDateTime from backend
  fulfilledAt?: string; // LocalDateTime from backend
  cancelledAt?: string; // LocalDateTime from backend
  queuePosition?: number;
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
  notificationSent?: boolean;
  notes?: string;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  AVAILABLE = 'AVAILABLE',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface ReservationRequest {
  bookId: number;
  notes?: string;
}

export interface ReservationSearchRequest {
  userId?: number;
  bookId?: number;
  status?: ReservationStatus;
  activeOnly?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

// Import existing BookLoan from loan.model.ts
import { BookLoan, PageResponse, CheckoutRequest, RenewalRequest } from '@models/index';

export { BookLoan, PageResponse, CheckoutRequest, RenewalRequest };

export interface BookLoan {
  id: number;
  userId: number;
  bookId: number;
  type: BookLoanType;
  status: BookLoanStatus;
  checkoutDate: string; // LocalDate from backend (ISO format)
  returnDate?: string; // LocalDate from backend (ISO format)
  dueDate: string; // LocalDate from backend (ISO format)
  renewalCount: number;
  maxRenewals: number;
  notes?: string;
  isOverdue: boolean;
  overdueDays: number;
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

export enum BookLoanType {
  CHECKOUT = 'CHECKOUT'
}

export enum BookLoanStatus {
  CHECKED_OUT = 'CHECKED_OUT',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST'
}

export interface CheckoutRequest {
  bookId: number;
  checkoutDays?: number; // Optional, defaults to 14 on backend
  notes?: string;
}

export interface CheckinRequest {
  bookLoanId: number;
  condition?: BookLoanStatus; // Defaults to RETURNED on backend
  notes?: string;
}

export interface RenewalRequest {
  bookLoanId: number;
  extensionDays?: number; // Optional, defaults to 14 on backend
  notes?: string;
}

export interface BookLoanSearchRequest {
  userId?: number;
  bookId?: number;
  overdueOnly?: boolean;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

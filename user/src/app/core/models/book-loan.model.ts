export interface BookLoan {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor?: string;
  bookISBN?: string;
  userId?: number;
  checkoutDate: string;
  dueDate: string;
  checkInDate?: string;
  status: BookLoanStatus;
  type: BookLoanType;
  renewalCount: number;
  maxRenewals: number;
  isOverdue: boolean;
  overdueDays: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum BookLoanStatus {
  CHECKED_OUT = 'CHECKED_OUT',
  CHECKED_IN = 'CHECKED_IN',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST',
}

export enum BookLoanType {
  CHECKOUT = 'CHECKOUT',
  RESERVATION = 'RESERVATION',
}

export interface CheckoutRequest {
  bookId: number;
  checkoutDays?: number;
  notes?: string;
}

export interface CheckinRequest {
  loanId: number;
  notes?: string;
}

export interface RenewalRequest {
  loanId: number;
  renewalDays?: number;
}

export interface BookLoanHistory {
  totalBooksCheckedOut: number;
  totalBooksCheckedIn: number;
  totalOverdueBooks: number;
  loans: BookLoan[];
}

export interface BookLoanSearchRequest {
  userId?: number;
  status?: BookLoanStatus;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

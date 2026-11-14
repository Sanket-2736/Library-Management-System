import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  BookLoan,
  CheckoutRequest,
  CheckinRequest,
  RenewalRequest,
  BookLoanSearchRequest,
  PageResponse,
  BookLoanStatus,
} from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class BookLoanService {
  private apiUrl = `${environment.apiUrl}/book-loans`;

  constructor(private http: HttpClient) {}

  /**
   * Checkout a book for current user
   * Endpoint: POST /api/book-loans/checkout
   * Request: CheckoutRequest
   * Status: 201 CREATED
   * 
   * Error cases (400):
   * - Book not found
   * - Book is not active
   * - Book is not available
   * - Book already has an active checkout
   * - Reached maximum limit of books allowed
   * - First return old overdue book
   */
  checkoutBook(request: CheckoutRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/checkout`, request);
  }

  /**
   * Checkout a book for a specific user (admin endpoint)
   * Endpoint: POST /api/book-loans/checkout/user/{userId}
   * Request: CheckoutRequest
   * Status: 201 CREATED
   */
  checkoutBookForUser(userId: number, request: CheckoutRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/checkout/user/${userId}`, request);
  }

  /**
   * Return/checkin a book
   * Endpoint: POST /api/book-loans/checkin
   * Request: CheckinRequest
   * Status: 200 OK
   */
  checkinBook(request: CheckinRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/checkin`, request);
  }

  /**
   * Renew a book checkout
   * Endpoint: POST /api/book-loans/renew
   * Request: RenewalRequest
   * Status: 200 OK
   */
  renewCheckout(request: RenewalRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/renew`, request);
  }

  /**
   * Get current user's book loans
   * Endpoint: GET /api/book-loans/my
   * Query parameters:
   * - status: Optional BookLoanStatus filter
   * - page: 0-indexed page number (default: 0)
   * - size: Page size (default: 20)
   * 
   * Returns: PageResponse<BookLoanDTO>
   */
  getMyBookLoans(
    status?: BookLoanStatus,
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<BookLoan>> {
    let url = `${this.apiUrl}/my?page=${page}&size=${size}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<PageResponse<BookLoan>>(url);
  }

  /**
   * Search book loans (admin endpoint)
   * Endpoint: POST /api/book-loans/admin/search
   * Request: BookLoanSearchRequest
   * 
   * Supported filters:
   * - userId: Filter by user
   * - bookId: Filter by book
   * - overdueOnly: Show only overdue books
   * - startDate: Filter by date range start
   * - endDate: Filter by date range end
   * - page: 0-indexed page number
   * - size: Page size
   * - sortBy: Field to sort by
   * - sortDirection: ASC or DESC
   */
  searchBookLoans(request: BookLoanSearchRequest): Observable<PageResponse<BookLoan>> {
    return this.http.post<PageResponse<BookLoan>>(`${this.apiUrl}/admin/search`, request);
  }

  /**
   * Update overdue book loans (admin endpoint)
   * Endpoint: POST /api/book-loans/admin/update-overdue
   * Returns: ApiResponse
   */
  updateOverdueLoans(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/update-overdue`, {});
  }
}

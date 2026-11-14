import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BookLoan,
  CheckoutRequest,
  CheckinRequest,
  RenewalRequest,
  BookLoanHistory,
} from '../models/book-loan.model';

@Injectable({
  providedIn: 'root',
})
export class BookLoanService {
  private apiUrl = `${environment.apiUrl}/book-loans`;

  constructor(private http: HttpClient) {}

  /**
   * Checkout a book
   */
  checkoutBook(request: CheckoutRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/checkout`, request);
  }

  /**
   * Checkin a book
   */
  checkinBook(request: CheckinRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/checkin`, request);
  }

  /**
   * Renew a book loan
   */
  renewBook(request: RenewalRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/renew`, request);
  }

  /**
   * Get current user's book loans
   */
  getMyBookLoans(
    status?: string,
    page: number = 0,
    size: number = 20,
  ): Observable<any> {
    let params: any = {
      page: page.toString(),
      size: size.toString(),
    };

    if (status) {
      params.status = status;
    }

    return this.http.get<any>(`${this.apiUrl}/my`, { params });
  }

  /**
   * Get specific loan by ID
   */
  getLoanById(id: number): Observable<BookLoan> {
    return this.http.get<BookLoan>(`${this.apiUrl}/${id}`);
  }
}

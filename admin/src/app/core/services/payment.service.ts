import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PaymentDTO, PaymentVerifyRequest, PageResponse } from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Verify a Razorpay payment
   * Endpoint: POST /api/payments/verify
   * Request: PaymentVerifyRequest
   * Returns: PaymentDTO
   */
  verifyPayment(request: PaymentVerifyRequest): Observable<PaymentDTO> {
    return this.http.post<PaymentDTO>(`${this.apiUrl}/verify`, request);
  }

  /**
   * Get all payments with pagination
   * Endpoint: GET /api/payments
   * Query parameters:
   * - page: 0-indexed page number (default: 0)
   * - size: Page size (default: 10)
   * - sortBy: Field to sort by (default: 'createdAt')
   * - sortDir: Sort direction ASC or DESC (default: 'DESC')
   * 
   * Returns: PageResponse<PaymentDTO>
   */
  getAllPayments(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'DESC'
  ): Observable<PageResponse<PaymentDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<PaymentDTO>>(`${this.apiUrl}`, { params });
  }
}

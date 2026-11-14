import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Payment,
  PaymentVerifyRequest,
  PaymentOrderResponse,
  PaymentHistory,
} from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Verify payment after Razorpay checkout
   */
  verifyPayment(request: PaymentVerifyRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/verify`, request);
  }

  /**
   * Get all payments for current user
   */
  getPayments(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  }

  /**
   * Get payment by ID
   */
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }
}

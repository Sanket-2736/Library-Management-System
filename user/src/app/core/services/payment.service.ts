import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PaymentDTO } from '@core/models/payment.model';

export interface PaymentVerifyRequest {
  razorpayPaymentId: string;
  stripePaymentIntentId?: string;
  stripePaymentIntentStatus?: string;
}

export interface PaymentInitiateResponse {
  orderId: string;
  amount: number;
  currency?: string;
  description?: string;
  razorpayKeyId?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Verify Razorpay payment
   * Backend verifies the payment signature
   */
  verifyPayment(request: PaymentVerifyRequest): Observable<PaymentDTO> {
    return this.http.post<PaymentDTO>(`${this.apiUrl}/verify`, request);
  }

  /**
   * Get all payments for current user
   */
  getAllPayments(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy: 'createdAt',
        sortDir: 'DESC',
      },
    });
  }
}

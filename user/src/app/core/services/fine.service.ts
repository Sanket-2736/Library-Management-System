import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Fine, FineFilter, FineStatus, FineType, PaymentInitiateResponse } from '@core/models/index';

@Injectable({
  providedIn: 'root',
})
export class FineService {
  private apiUrl = `${environment.apiUrl}/fine`;

  constructor(private http: HttpClient) {}

  /**
   * Get current user's fines
   * Endpoint: GET /api/fine/my
   * Query parameters:
   * - status: FineStatus (optional)
   * - type: FineType (optional)
   * Returns: List<FineDTO>
   */
  getMyFines(filter?: FineFilter): Observable<Fine[]> {
    let params = new HttpParams();
    if (filter?.status) {
      params = params.set('status', filter.status);
    }
    if (filter?.type) {
      params = params.set('type', filter.type);
    }
    return this.http.get<Fine[]>(`${this.apiUrl}/my`, { params });
  }

  /**
   * Pay a fine
   * Endpoint: POST /api/fine/{fineId}/pay
   * Returns: PaymentInitiateResponse with Razorpay order details
   */
  payFine(fineId: number): Observable<PaymentInitiateResponse> {
    return this.http.post<PaymentInitiateResponse>(`${this.apiUrl}/${fineId}/pay`, {});
  }

  /**
   * Get all fines (admin endpoint)
   * Endpoint: GET /api/fine
   * Query parameters:
   * - status: FineStatus (optional)
   * - type: FineType (optional)
   * - userId: number (optional)
   * - page: number (default: 0)
   * - size: number (default: 10)
   * Returns: PageResponse<FineDTO>
   */
  getAllFines(
    status?: FineStatus,
    type?: FineType,
    userId?: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (type) {
      params = params.set('type', type);
    }
    if (userId) {
      params = params.set('userId', userId.toString());
    }

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }
}

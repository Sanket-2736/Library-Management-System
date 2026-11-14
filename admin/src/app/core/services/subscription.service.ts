import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  SubscriptionDTO,
  CreateSubscriptionRequest,
} from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  /**
   * Subscribe to a subscription plan
   * Endpoint: POST /api/subscriptions/subscribe
   * Request: SubscriptionDTO with plan details
   */
  subscribe(request: CreateSubscriptionRequest): Observable<SubscriptionDTO> {
    return this.http.post<SubscriptionDTO>(`${this.apiUrl}/subscribe`, request);
  }

  /**
   * Cancel a subscription
   * Endpoint: POST /api/subscriptions/cancel/{subscriptionId}
   * Body: reason (optional string)
   */
  cancelSubscription(id: number, reason?: string): Observable<SubscriptionDTO> {
    const body = reason ? reason : '';
    return this.http.post<SubscriptionDTO>(`${this.apiUrl}/cancel/${id}`, body);
  }

  /**
   * Activate a subscription
   * Endpoint: POST /api/subscriptions/activate?subscriptionId={id}
   */
  activateSubscription(id: number): Observable<SubscriptionDTO> {
    return this.http.post<SubscriptionDTO>(`${this.apiUrl}/activate?subscriptionId=${id}`, {});
  }

  /**
   * Get user's active subscription
   * Endpoint: GET /api/subscriptions/user/active
   * Query params:
   * - userId: Optional, if not provided uses current authenticated user
   */
  getUsersActiveSubscription(userId?: number): Observable<SubscriptionDTO> {
    let url = `${this.apiUrl}/user/active`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get<SubscriptionDTO>(url);
  }

  /**
   * Get all subscriptions (admin endpoint)
   * Endpoint: GET /api/subscriptions/admin
   * Returns: List<SubscriptionDTO>
   */
  getAllSubscriptions(): Observable<SubscriptionDTO[]> {
    return this.http.get<SubscriptionDTO[]>(`${this.apiUrl}/admin`);
  }

  /**
   * Deactivate expired subscriptions (admin endpoint)
   * Endpoint: GET /api/subscriptions/admin/deactivate-expired
   * Returns: ApiResponse
   */
  deactivateExpiredSubscriptions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/deactivate-expired`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Subscription,
  SubscriptionPlan,
  CreateSubscriptionRequest,
  SubscriptionHistory,
} from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;
  private planUrl = `${environment.apiUrl}/subscription-plans`;

  constructor(private http: HttpClient) {}

  /**
   * Get all subscription plans
   * GET /api/subscription-plans
   */
  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(this.planUrl);
  }

  /**
   * Get subscription plan by ID
   * GET /api/subscription-plans/{id}
   */
  getPlanById(id: number): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.planUrl}/${id}`);
  }

  /**
   * Subscribe to a plan
   * POST /api/subscriptions/subscribe
   * Returns: PaymentInitiateResponse
   */
  subscribe(request: CreateSubscriptionRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subscribe`, request);
  }

  /**
   * Get current user's active subscription
   * GET /api/subscriptions/user/active
   */
  getUserActiveSubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/user/active`);
  }

  /**
   * Get subscription by ID
   * GET /api/subscriptions/{id}
   */
  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cancel subscription
   * POST /api/subscriptions/cancel/{subscriptionId}
   */
  cancelSubscription(
    subscriptionId: number,
    reason?: string,
  ): Observable<Subscription> {
    const body = reason ? { reason } : {};
    return this.http.post<Subscription>(
      `${this.apiUrl}/cancel/${subscriptionId}`,
      body,
    );
  }

  /**
   * Activate subscription (after payment)
   * POST /api/subscriptions/activate
   */
  activateSubscription(subscriptionId: number): Observable<Subscription> {
    return this.http.post<Subscription>(
      `${this.apiUrl}/activate`,
      {},
      {
        params: new HttpParams().set('subscriptionId', subscriptionId.toString()),
      },
    );
  }
}

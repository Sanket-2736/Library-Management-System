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
   */
  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(this.planUrl);
  }

  /**
   * Get subscription plan by ID
   */
  getPlanById(id: number): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.planUrl}/${id}`);
  }

  /**
   * Subscribe to a plan
   */
  subscribe(request: CreateSubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/subscribe`, request);
  }

  /**
   * Get current user's active subscription
   */
  getUserActiveSubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/user/active`);
  }

  /**
   * Get subscription by ID
   */
  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cancel subscription
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

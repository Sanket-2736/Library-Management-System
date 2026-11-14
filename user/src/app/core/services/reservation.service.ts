import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Reservation, ReservationRequest, ReservationSearchRequest, ReservationStatus } from '@core/models/index';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  /**
   * Create a reservation for current user
   * Endpoint: POST /api/reservations
   * Note: This endpoint may not exist yet. Check backend for actual endpoint.
   */
  createReservation(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}`, request);
  }

  /**
   * Get my reservations
   * Endpoint: GET /api/reservations/my (if exists)
   * or use search endpoint with current user ID
   * Returns: List<ReservationDTO> or PageResponse<ReservationDTO>
   */
  getMyReservations(
    status?: ReservationStatus,
    page: number = 0,
    size: number = 20
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<any>(`${this.apiUrl}/my`, { params });
  }

  /**
   * Cancel a reservation
   * Endpoint: POST /api/reservations/{reservationId}/cancel (if exists)
   */
  cancelReservation(reservationId: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/${reservationId}/cancel`, {});
  }

  /**
   * Search reservations (admin endpoint)
   * Endpoint: POST /api/reservations/search
   */
  searchReservations(request: ReservationSearchRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/search`, request);
  }

  /**
   * Get specific reservation details
   * Endpoint: GET /api/reservations/{reservationId}
   */
  getReservationById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${reservationId}`);
  }
}

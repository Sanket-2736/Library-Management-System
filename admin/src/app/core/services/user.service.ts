import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { UserDTO } from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get all users
   * Endpoint: GET /api/users/list
   * Returns: List<UserDTO>
   */
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/list`);
  }

  /**
   * Get current authenticated user's profile
   * Endpoint: GET /api/users/profile
   * Returns: User (extends UserDTO with additional fields)
   * 
   * Note: Backend returns User model which includes additional fields like
   * role, lastLogin, createdAt, updatedAt (not explicitly documented in UserDTO)
   */
  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/profile`);
  }
}

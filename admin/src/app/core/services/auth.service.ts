import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UserDTO,
  ForgetPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
} from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  /**
   * Login with email and password
   * Endpoint: POST /api/auth/login
   * Request: LoginRequest
   * Response: AuthResponse with JWT token
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.storeAuth(response);
      })
    );
  }

  /**
   * Sign up new user
   * Endpoint: POST /api/auth/signup
   * Request: SignupRequest (extends UserDTO)
   * Response: AuthResponse with JWT token
   * Status: 201 CREATED
   */
  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request).pipe(
      tap(response => {
        this.storeAuth(response);
      })
    );
  }

  /**
   * Logout and clear stored auth
   */
  logout(): void {
    localStorage.removeItem(environment.jwtTokenKey);
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  /**
   * Request password reset link
   * Endpoint: POST /api/auth/forgot-password
   * Request: ForgetPasswordRequest with email
   * Response: ApiResponse with success message
   */
  forgotPassword(request: ForgetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, request);
  }

  /**
   * Reset password with token
   * Endpoint: POST /api/auth/reset-password
   * Request: ResetPasswordRequest with token and new password
   * Response: ApiResponse with success message
   */
  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password`, request);
  }

  /**
   * Get currently authenticated user
   */
  getCurrentUser(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Store authentication response
   */
  private storeAuth(response: AuthResponse): void {
    localStorage.setItem(environment.jwtTokenKey, response.jwt);
    this.tokenSubject.next(response.jwt);
    this.currentUserSubject.next(response.user);
  }

  /**
   * Load stored authentication from localStorage
   */
  private loadStoredAuth(): void {
    const token = localStorage.getItem(environment.jwtTokenKey);
    if (token) {
      this.tokenSubject.next(token);
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Genre, CreateGenreRequest, UpdateGenreRequest } from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = `${environment.apiUrl}/genres`;

  constructor(private http: HttpClient) {}

  /**
   * Get all genres
   * Endpoint: GET /api/genres
   * Returns: List<GenreDTO>
   */
  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}`);
  }

  /**
   * Get genre by ID
   * Endpoint: GET /api/genres/{genreId}
   */
  getGenreById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get top-level genres (without parent)
   * Endpoint: GET /api/genres/top-level
   * Returns: List<GenreDTO>
   */
  getTopLevelGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/top-level`);
  }

  /**
   * Get total count of active genres
   * Endpoint: GET /api/genres/count
   * Returns: number
   */
  getTotalActiveGenres(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  /**
   * Get number of books in a specific genre
   * Endpoint: GET /api/genres/{id}/book-count
   * Returns: number
   */
  getBookCountByGenre(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/book-count`);
  }

  // Admin endpoints
  createGenre(request: CreateGenreRequest): Observable<Genre> {
    return this.http.post<Genre>(`${this.apiUrl}/create`, request);
  }

  updateGenre(id: number, request: UpdateGenreRequest): Observable<Genre> {
    return this.http.put<Genre>(`${this.apiUrl}/${id}`, request);
  }

  deleteGenre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  hardDeleteGenre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/hard`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Book,
  BookSearchRequest,
  PageResponse,
} from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  /**
   * Get all books without pagination
   * Endpoint: GET /api/books
   */
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}`);
  }

  /**
   * Get a specific book by ID
   * Endpoint: GET /api/books/{bookId}
   */
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get a specific book by ISBN
   * Endpoint: GET /api/books/isbn/{isbn}
   */
  getBookByISBN(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/isbn/${isbn}`);
  }

  /**
   * Search books with filters and pagination
   * Endpoint: POST /api/books/search
   * 
   * Supported filters:
   * - searchTerm: Search in title/author
   * - genreId: Filter by genre
   * - availableOnly: Only show available books
   * - page: 0-indexed page number (default: 0)
   * - size: Page size (default: 20, max: 100)
   * - sortBy: Field to sort by (default: createdAt)
   * - sortDirection: ASC or DESC (default: DESC)
   */
  searchBooks(request: BookSearchRequest): Observable<PageResponse<Book>> {
    // Set default values matching backend
    const searchRequest = {
      page: request.page ?? 0,
      size: request.size ?? 20,
      sortBy: request.sortBy ?? 'createdAt',
      sortDirection: request.sortDirection ?? 'DESC',
      ...request
    };
    return this.http.post<PageResponse<Book>>(`${this.apiUrl}/search`, searchRequest);
  }

  /**
   * Get count of total active books
   * Endpoint: GET /api/books/stats/active
   */
  getTotalActiveBooks(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/active`);
  }

  /**
   * Get book availability statistics
   * Endpoint: GET /api/books/stats/available
   * Returns: { totalActiveBooks: number, totalAvailableBooks: number }
   */
  getTotalAvailableBooks(): Observable<{ totalActiveBooks: number; totalAvailableBooks: number }> {
    return this.http.get<{ totalActiveBooks: number; totalAvailableBooks: number }>(
      `${this.apiUrl}/stats/available`
    );
  }
}

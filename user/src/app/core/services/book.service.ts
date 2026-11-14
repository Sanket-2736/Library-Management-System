import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, BookSearchRequest, BookSearchResponse, Genre } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private genreUrl = `${environment.apiUrl}/genres`;

  constructor(private http: HttpClient) {}

  /**
   * Get all books
   */
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  /**
   * Get book by ID
   */
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get book by ISBN
   */
  getBookByISBN(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/isbn/${isbn}`);
  }

  /**
   * Search books with filters
   */
  searchBooks(request: BookSearchRequest): Observable<BookSearchResponse> {
    return this.http.post<BookSearchResponse>(`${this.apiUrl}/search`, request);
  }

  /**
   * Get book statistics
   */
  getBookStats(): Observable<{ totalActiveBooks: number; totalAvailableBooks: number }> {
    return this.http.get<{ totalActiveBooks: number; totalAvailableBooks: number }>(
      `${this.apiUrl}/stats/available`,
    );
  }

  /**
   * Get all genres
   */
  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.genreUrl);
  }

  /**
   * Get genre by ID
   */
  getGenreById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.genreUrl}/${id}`);
  }

  /**
   * Get top-level genres
   */
  getTopLevelGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.genreUrl}/top-level`);
  }

  /**
   * Get book count by genre
   */
  getBookCountByGenre(genreId: number): Observable<number> {
    return this.http.get<number>(`${this.genreUrl}/${genreId}/book-count`);
  }
}

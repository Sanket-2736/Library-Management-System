export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  genreId: number;
  publisher?: string;
  publishedAt?: string; // LocalDateTime from backend
  language?: string;
  pages?: number;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  price?: number;
  coverImageUrl?: string;
  active: boolean;
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

export interface CreateBookRequest {
  isbn: string;
  title: string;
  author: string;
  genreId: number;
  totalCopies: number;
  publisher?: string;
  publishedAt?: string;
  language?: string;
  pages?: number;
  description?: string;
  price?: number;
  coverImageUrl?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  genreId?: number;
  totalCopies?: number;
  publisher?: string;
  publishedAt?: string;
  language?: string;
  pages?: number;
  description?: string;
  price?: number;
  coverImageUrl?: string;
}

export interface BookSearchRequest {
  searchTerm?: string; // Backend uses searchTerm
  genreId?: number;
  availableOnly?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

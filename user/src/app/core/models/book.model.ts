export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  genreId?: number;
  genreName?: string;
  totalCopies: number;
  availableCopies: number;
  active: boolean;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookSearchRequest {
  keyword?: string;
  genreId?: number;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface BookSearchResponse {
  content: Book[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
  parentGenreId?: number;
  bookCount?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

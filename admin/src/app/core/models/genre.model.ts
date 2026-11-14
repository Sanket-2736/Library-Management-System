/**
 * Genre DTO from backend
 * Supports hierarchical genres with parent-child relationships
 */
export interface Genre {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  parentGenreId?: number;
  parentGenreName?: string;
  subGenre?: Genre[];
  bookCount?: number; // Number of books in this genre
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

export interface CreateGenreRequest {
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  parentGenreId?: number;
}

export interface UpdateGenreRequest {
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
}

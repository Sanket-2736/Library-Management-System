import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/index';

export const GENRES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./list/genres-list.component').then(m => m.GenresListComponent),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./books-by-genre/books-by-genre.component').then(
        m => m.BooksByGenreComponent
      ),
  },
];
